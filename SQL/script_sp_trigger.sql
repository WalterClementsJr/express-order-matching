
CREATE PROCEDURE [dbo].[GetGD]
@cursor CURSOR VARYING OUTPUT,
@macp NCHAR(7),
@ngay DATETIME,
@loaigd NCHAR(1)
AS
-- get buy orders
IF (@loaigd = 'M')
    SET @cursor = CURSOR KEYSET FOR
        SELECT ld_id, NGAYDAT, SOLUONG, GIADAT FROM LENHDAT
        WHERE MACP = @macp
        AND CONVERT(date, NGAYDAT) = CONVERT(date, @ngay)
        AND LOAIGD = 'M'
        AND SOLUONG > 0
        ORDER BY GIADAT DESC, NGAYDAT

-- get sell orders
ELSE
    SET @cursor = CURSOR KEYSET FOR
        SELECT ld_id, NGAYDAT, SOLUONG, GIADAT FROM LENHDAT
        WHERE MACP = @macp
        AND CONVERT(date, NGAYDAT) = CONVERT(date, @ngay)
        AND LOAIGD = 'B'
        AND SOLUONG > 0
        ORDER BY GIADAT, NGAYDAT
OPEN @cursor
GO
/****** Object:  StoredProcedure [dbo].[LimitOrderMatching]    Script Date: 2022-04-29 20:36:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LimitOrderMatching] @paramMacp NCHAR(7),
                                    @paramNgay DATETIME,
                                    @paramLoaiGD NCHAR(1),
                                    @paramSoLuong INT,
                                    @paramGiaDat FLOAT
AS
DECLARE
    @cursor CURSOR,
    @ld_id       int,
    @ngayDat     DATETIME,
    @soLuong     INT,
    @giaDat      FLOAT,
    @soluongkhop INT,
    @giakhop     FLOAT
    
    IF (@paramLoaiGD = 'B')
        EXEC GetGD @cursor OUTPUT, @paramMacp, @paramNgay, 'M'
    ELSE
        EXEC GetGD @cursor OUTPUT, @paramMacp, @paramNgay, 'B'

    FETCH NEXT FROM @cursor INTO @ld_id, @ngayDat, @soLuong, @giaDat
    WHILE (@@FETCH_STATUS <> -1 AND @paramSoLuong > 0)
        BEGIN
            IF (@paramLoaiGD = 'B')
                IF (@paramGiaDat <= @giaDat)
                    BEGIN

                        IF (@paramSoLuong >= @soLuong)
                            BEGIN
                                SET @soluongkhop = @soLuong
                                SET @giakhop = @giaDat
                                SET @paramSoLuong = @paramSoLuong - @soLuong

                                -- update lenhdat
                                UPDATE dbo.LenhDat
                                SET SoLuong       = 0,
                                    trangthailenh = N'KHOP_HET'
                                WHERE CURRENT OF @cursor

                            END

                        ELSE -- (@paramSoLuong < @soLuong )
                            BEGIN
                                SET @soluongkhop = @paramSoLuong
                                SET @giakhop = @giaDat

                                UPDATE dbo.LenhDat
                                SET SoLuong       = SoLuong - @paramSoLuong,
                                    trangthailenh = N'KHOP_1_P'
                                WHERE CURRENT OF @cursor
                                SET @paramSoLuong = 0
                            END

                        -- insert LENHKHOP
                        INSERT INTO dbo.LenhKhop(soluongkhop, giakhop, lenhdat_id)
                        VALUES (@soluongkhop, @giakhop, @ld_id)

                    END
                ELSE
                    -- IF (@paramGiaDat > @giaDat)
                    GOTO END_PROC

            ELSE -- @paramLoaiGD = 'M')
                IF (@paramGiaDat >= @giaDat)
                    BEGIN
                        IF (@paramSoLuong >= @soLuong)
                            BEGIN
                                SET @soluongkhop = @soLuong
                                SET @giakhop = @giaDat
                                SET @paramSoLuong = @paramSoLuong - @soLuong

                                UPDATE dbo.LenhDat
                                SET SoLuong      = 0,
                                    trangthailenh= N'KHOP_HET'
                                WHERE CURRENT OF @cursor

                            END

                        ELSE -- (@paramSoLuong < @soLuong)
                            BEGIN
                                SET @soluongkhop = @paramSoLuong
                                SET @giakhop = @giaDat

                                UPDATE dbo.LenhDat
                                SET SoLuong       = SoLuong - @paramSoLuong,
                                    trangthailenh = N'KHOP_1_P'
                                WHERE CURRENT OF @cursor

                                SET @paramSoLuong = 0

                            END

                        -- insert table LENHKHOP
                        INSERT INTO dbo.LenhKhop(soluongkhop, giakhop, lenhdat_id)
                        VALUES (@soluongkhop, @giakhop, @ld_id)
                    END
                ELSE
                    -- IF (@paramGiaDat < @giaDat)
                    GOTO END_PROC
            -- move cursor to next row
            FETCH NEXT FROM @cursor INTO @ld_id, @ngayDat, @soLuong, @giaDat
        END
    END_PROC:
    -- still has leftovers
    IF (@paramSoLuong > 0)
        BEGIN
            INSERT INTO dbo.LenhDat(macp, loaigd, soluong, giadat, trangthailenh)
            VALUES (@paramMacp, @paramLoaiGD, @paramSoLuong, @paramGiaDat, N'CHO_KHOP')
        END

    ELSE
        BEGIN
            -- @paramsoluong = 0, order is matched completely
            INSERT INTO dbo.LenhDat(macp, loaigd, SoLuong, GiaDat, trangthailenh)
            VALUES (@paramMacp, @paramLoaiGD, @paramSoLuong, @paramGiaDat, N'KHOP_HET')
        END

    CLOSE @cursor
    DEALLOCATE @cursor
GO
/****** Object:  Trigger [dbo].[TR_LenhDat]    Script Date: 2022-04-29 20:36:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TRIGGER [dbo].[TR_LenhDat]
ON [dbo].[LENHDAT] 
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @macp NCHAR(7)
    -- if macp is in BangGia
	IF EXISTS (SELECT macp FROM BangGia
			   WHERE macp = (SELECT macp FROM INSERTED))
	BEGIN
        PRINT 'MACP exist. update record'

		DECLARE @cursor CURSOR,
                -- buy price - descending
                @giaM1 FLOAT,
                @soluongM1 INT,
                @giaM2 FLOAT,
                @soluongM2 INT,
                @giaM3 FLOAT,
                @soluongM3 INT,
                -- sell price - ascending
                @giaB1 FLOAT,
                @soluongB1 INT,
                @giaB2 FLOAT,
                @soluongB2 INT,
                @giaB3 FLOAT,
                @soluongB3 INT
		SET @cursor = CURSOR FOR SELECT DISTINCT macp FROM LENHDAT

		OPEN @cursor

		FETCH NEXT FROM @cursor INTO @macp
		WHILE(@@FETCH_STATUS <> -1)
		BEGIN
			SET @giaM1 =
                (SELECT MAX(GIADAT) 
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'M'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate()))

			SET @soluongM1 =
            (SELECT SUM(SOLUONG)
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'M'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT = @giaM1)

			SET @giaM2 =
                (SELECT MAX(GIADAT)
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'M'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT < @giaM1)

			SET @soluongM2 =
                (SELECT SUM(SOLUONG) 
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'M'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT = @giaM2)

			SET @giaM3 =
                (SELECT MAX(GIADAT) 
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'M'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT < @giaM2)

			SET @soluongM3 =
                (SELECT SUM(SOLUONG) 
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'M'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT = @giaM3)

			SET @giaB1 = (SELECT MIN(GIADAT) 
				FROM LENHDAT WHERE macp = @macp
                AND loaiGD = 'B'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate()))

			SET @soluongB1 =
                (SELECT SUM(SOLUONG) 
				FROM LENHDAT WHERE macp = @macp
                AND loaiGD = 'B'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT = @giaB1)

			SET @giaB2 =
                (SELECT MIN(GIADAT) 
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'B'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT > @giaB1)

			SET @soluongB2 =
                (SELECT SUM(SOLUONG) 
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'B'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT = @giaB2)

			SET @giaB3 = (SELECT MIN(GIADAT) 
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'B'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT > @giaB2)

			SET @soluongB3 =
                (SELECT SUM(SOLUONG) 
				FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'B'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT = @giaB3)

			UPDATE BangGia
            SET 
			giaM1 = @giaM1,
			soluongM1 = @soluongM1,
			giaM2 = @giaM2, 
			soluongM2 = @soluongM2,
			giaM3 = @giaM3,
			soluongM3 = @soluongM3,
	
			giaB1 = @giaB1,
			soluongB1 = @soluongB1,
			giaB2 = @giaB2,
			soluongB2 = @soluongB2,
            giaB3 = @giaB3,
			soluongB3= @soluongB3
			WHERE macp = @macp 

            -- move to next row
			FETCH NEXT FROM @cursor INTO @macp
		END
		CLOSE @cursor 
		DEALLOCATE @cursor
	END
    -- macp doesn't exist in banggia -> insert to highest sell B3 or highest buy M1 + amount
	ELSE
	BEGIN
        PRINT 'BANGGIA: MACP does not exist. insert record'

		SET @macp = (SELECT macp FROM inserted)

        DECLARE @loaigd CHAR(1)
        set @loaigd = (select loaigd from inserted)


        -- insert to highest buy M1
        IF (@loaigd = 'M')
        begin
		    SET @giaM1 =
                (SELECT MAX(GIADAT)
			    FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'M'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate()))

		    SET @soluongM1 =
                (SELECT SUM(SOLUONG)
			    FROM LENHDAT
                WHERE macp = @macp
                AND loaiGD = 'M'
                AND SOLUONG > 0
                AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
                AND GIADAT = @giaM1)

		    INSERT INTO BangGia(macp, giaM1, soluongM1, tongKL)
		    VALUES(@macp, @giaB3, @soluongB3, 0)

        END
        -- insert to highest sell B1
        else
        begin
		SET @giaB3 =
            (SELECT MIN(GIADAT)
			FROM LENHDAT
            WHERE macp = @macp
            AND loaiGD = 'B'
            AND SOLUONG > 0
            AND CONVERT(date, ngaydat) = CONVERT(date, getdate()))

		SET @soluongB3 =
            (SELECT SUM(SOLUONG)
			FROM LENHDAT
            WHERE macp = @macp
            AND loaiGD = 'B'
            AND SOLUONG > 0
            AND CONVERT(date, ngaydat) = CONVERT(date, getdate())
            AND GIADAT = @giaB3)
        
		INSERT INTO BangGia(macp, giaB3, soluongB3, tongKL)
		VALUES(@macp, @giaB3, @soluongB3, 0)

        END
	END
END
GO
ALTER TABLE [dbo].[LENHDAT] ENABLE TRIGGER [TR_LenhDat]
GO
/****** Object:  Trigger [dbo].[TR_LenhKhop]    Script Date: 2022-04-29 20:36:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TRIGGER [dbo].[TR_LenhKhop]
ON [dbo].[LENHKHOP] 
AFTER INSERT
AS
DECLARE @MACP NCHAR(7)
BEGIN
		SET @MACP = (SELECT LD.macp FROM LENHDAT LD, INSERTED x WHERE LD.ld_id = x.lenhdat_id)

		UPDATE BANGGIA SET
        giaKhop = (SELECT GIAKHOP FROM INSERTED),
        soLuongKhop = (SELECT SOLUONGKHOP FROM INSERTED),
        TONGKL = TONGKL + (SELECT SOLUONGKHOP FROM INSERTED)
		WHERE BANGGIA.macp = @MACP
END
GO
ALTER TABLE [dbo].[LENHKHOP] ENABLE TRIGGER [TR_LenhKhop]
GO
