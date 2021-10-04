using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using API.Helpers;
using API.Entities;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
namespace API.Services
{
    public class RedisService
    {
        private readonly string _redisUrl;
        private readonly string _redisPassword;
        private readonly int _redisPort;

        private ConnectionMultiplexer _redis;
        public RedisService(IOptions<RedisSettings> config)
        {
            _redisUrl = config.Value.Url;
            _redisPort = config.Value.Port;
            _redisPassword = config.Value.Password;
        }

        public void Connect()
        {
            try
            {
                var configString = $"{_redisUrl}:{_redisPort},password={_redisPassword}";
                Console.WriteLine("Config String: " + configString);
                _redis = ConnectionMultiplexer.Connect(configString);
            }
            catch (RedisConnectionException ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }
            Console.WriteLine("Connected to Redis");
        }

        public Task<string[]> GetOnlineUsers()
        {
            var db = _redis.GetDatabase();
            var endPoint = _redis.GetEndPoints().FirstOrDefault();
            var server = _redis.GetServer(endPoint);
            var keys = server.Keys(db.Database);
            string[] ks = keys.OrderBy(k => k.ToString()).Select(k => k.ToString()).ToArray();

            return Task.FromResult(ks);
            // var cass = keys.Cast<string>();
            // var arr = cass.ToArray();
            // Console.WriteLine("Arr: " + arr);
            // return Task.FromResult(arr);
        }

        public Task<List<string>> GetConnectionsForUser(string username)
        {
            var db = _redis.GetDatabase();
            var rawJSON = db.StringGet(username);
            var connections = JsonSerializer.Deserialize<List<string>>(rawJSON);
            return Task.FromResult(connections);
        }

        public Task<bool> UserConnected(string username, string connectionId)
        {
            bool isOnline = false;
            var db = _redis.GetDatabase();
            if (db.KeyExists(username))
            {
                var connections = JsonSerializer.Deserialize<List<string>>(db.StringGet(username));
                connections.Add(connectionId);
                db.StringSet(username, JsonSerializer.Serialize(connections));
            }
            else
            {
                var json = JsonSerializer.Serialize(new List<string>{connectionId});
                db.StringSet(username, json);
                isOnline = true;
            }

            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isOffline = false;
            var db = _redis.GetDatabase();

            if (!db.KeyExists(username))
            {
                return Task.FromResult(isOffline);
            }

            var connections = JsonSerializer.Deserialize<List<string>>(db.StringGet(username));
            connections.Remove(connectionId);
            if (connections.Count == 0)
            {
                db.KeyDelete(username);
                isOffline = true;
            }

            return Task.FromResult(isOffline);
        }
        // public async Task<string> GetConnectionsFromUser(string username)
        // {
        //     List<string> connectionIds;
        //     var db = _redis.GetDatabase();
        //     return await db.StringGetAsync(username);
        // }
    }
}