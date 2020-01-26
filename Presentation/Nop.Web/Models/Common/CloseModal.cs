using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nop.Web.Models.Common
{
    public class CloseModal
    {
        public bool ShouldClose { get; set; }
        public bool Redirect { get; set; }
        public bool Reload { get; set; }
        public bool DisplayNotification { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Icon { get; set; }
        public string TargetUrl { get; set; }
        public bool ReloadAfterAction { get; set; }
        public string ElementTobeReloaded { get; set; }
    }
}
