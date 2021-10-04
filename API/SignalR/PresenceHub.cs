using System;
using System.Threading.Tasks;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        private readonly RedisService _redisService;

        public PresenceHub(PresenceTracker tracker, RedisService redisService)
        {
            _tracker = tracker;
            _redisService = redisService;
        }

        public override async Task OnConnectedAsync()
        {
            // var isOnline = await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            var isOnline = await _redisService.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            if (isOnline)
                await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());

            // var currentUsers = await _tracker.GetOnlineUsers();
            var currentUsers = await _redisService.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // var isOffline = await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
            var isOffline = await _redisService.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
            
            if (isOffline)
                await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());

            await base.OnDisconnectedAsync(exception);
        }
    }
}