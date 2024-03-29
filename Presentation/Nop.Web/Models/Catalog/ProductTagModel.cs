﻿using Nop.Web.Framework.Models;

namespace Nop.Web.Models.Catalog
{
    public partial class ProductTagModel : BaseNopEntityModel
    {
        public string[] TagNameData { get; set; }
        public string Name { get; set; }

        public string Icon { get; set; }


        public string SeName { get; set; }

        public int ProductCount { get; set; }
    }
}