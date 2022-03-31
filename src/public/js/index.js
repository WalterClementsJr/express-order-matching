const socket = io();
const tableBody = document.getElementById('tableBody');

socket.on('receive_data', data => {
    console.log(data);

    tableBody.innerHTML = "";
    let tr = "";

    data.forEach(item => {
        tr += '<tr>';
        tr +=
            '<td>' + item.macp.trim() + '</td>' +
            '<td>' + (item.giaM3 == null ? "" : item.giaM3) + '</td>' +
            '<td>' + (item.soluongM3 == null ? "" : item.soluongM3) + '</td>' +
            '<td>' + (item.giaM2 == null ? "" : item.giaM2) + '</td>' +
            '<td>' + (item.soluongM2 == null ? "" : item.soluongM2) + '</td>' +
            '<td>' + (item.giaM1 == null ? "" : item.giaM1) + '</td>' +
            '<td>' + (item.soluongM1 == null ? "" : item.soluongM1) + '</td>' +
            '<td>' + (item.giaKhop == null ? "" : item.giaKhop) + '</td>' +
            '<td>' + (item.soluongKhop == null ? "" : item.soluongKhop) + '</td>' +
            '<td>' + (item.giaB1 == null ? "" : item.giaB1) + '</td>' +
            '<td>' + (item.soluongB1 == null ? "" : item.soluongB1) + '</td>' +
            '<td>' + (item.giaB2 == null ? "" : item.giaB2) + '</td>' +
            '<td>' + (item.soluongB2 == null ? "" : item.soluongB2) + '</td>' +
            '<td>' + (item.giaB3 == null ? "" : item.giaB3) + '</td>' +
            '<td>' + (item.soluongB3 == null ? "" : item.soluongB3) + '</td>' +
            '<td>' + (item.tongKL == null ? "" : item.tongKL) + '</td>';
        tr += '</tr>'
    })
    tableBody.innerHTML = tr;
});
