using System;
using System.Data;
using System.Data.SqlClient;

namespace SqlDependencyInjector
{
    class Program
    {
        static string connectionString = @"Data Source=MSI;initial catalog=PriceDatabase;integrated security=True;User ID=sa;Password=123";
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
            using (var cmd = new SqlCommand("SELECT id, name, price FROM dbo.tbl_price", connection))
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
        static void onDependencyChange(object sender,
           SqlNotificationEventArgs e)
        {

            Console.WriteLine($"OnChange Event fired. SqlNotificationEventArgs: Info={e.Info}, Source={e.Source}, Type={e.Type}.");

            if ((e.Info != SqlNotificationInfo.Invalid)
                && (e.Type != SqlNotificationType.Subscribe))
            {
                //resubscribe
                var dt = getDataWithSqlDependency();
                Console.WriteLine("Data changed.");
                // var responseString = await client.GetStringAsync("http://localhost:3000");
                // Console.WriteLine($"Response: {responseString}");
            }
            else
            {
                Console.WriteLine("SqlDependency not restarted");
            }

        }


    }
}
