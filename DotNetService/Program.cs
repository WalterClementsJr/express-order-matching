using System;
using System.Data;
using System.Data.SqlClient;

namespace SqlDependencyInjector
{
    class Program
    {
        static string connectionString = @"Data Source=MSI;initial catalog=CHUNGKHOAN;integrated security=True;User ID=sa;Password=123";
        private static readonly HttpClient client = new HttpClient();

        static void Main(string[] args)
        {
            SqlDependency.Start(connectionString);

            getDataWithSqlDependency();

            Console.WriteLine("Waiting for data changes");
            Console.WriteLine("Press enter to quit");
            Console.ReadLine();

            SqlDependency.Stop(connectionString);
        }

        static DataTable getDataWithSqlDependency()
        {
            using (var connection = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(
                "SELECT id, macp, giaM3, soluongM3, giaM2, soluongM2, giaM1, soluongM1, giakhop, soluongkhop, giaB1, soluongB1, giaB2, soluongB2, giaB3, soluongB3, tongKL FROM dbo.BANGGIA",
                connection))
            {
                var dt = new DataTable();

                // Create dependency for this command and add event handler
                var dependency = new SqlDependency(cmd);
                dependency.OnChange += new OnChangeEventHandler(onDependencyChange);

                // execute command to get data
                connection.Open();
                dt.Load(cmd.ExecuteReader(CommandBehavior.CloseConnection));

                return dt;
            }
        }

        // Handler method
        static void onDependencyChange(object sender, SqlNotificationEventArgs args)
        {
            Console.WriteLine($"SqlNotificationEventArgs: Info={args.Info}, Source={args.Source}, Type={args.Type}.");

            if ((args.Info != SqlNotificationInfo.Invalid)
                && (args.Type != SqlNotificationType.Subscribe))
            {
                // resubscribe
                var dt = getDataWithSqlDependency();
                Console.WriteLine("Data changed.");

                // send GET request to Node end point
                 _ = notifyServer();
            }
            else
            {
                Console.WriteLine("SqlDependency not restarted");
            }
        }

        static async Task notifyServer()
        {
            try
            {
                var responseString = await client.GetStringAsync("http://localhost:3000/notify");
                Console.WriteLine($"Response: {responseString}");
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine("Http Request Exception caught: {0}", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception caught: {0}", ex);
            }
        }
    }
}
