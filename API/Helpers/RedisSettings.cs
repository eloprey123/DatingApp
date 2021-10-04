using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class RedisSettings
    {
        public string Url { get; set; }

        public string Port { get; set; }

        public string Password { get; set; }
    }
}