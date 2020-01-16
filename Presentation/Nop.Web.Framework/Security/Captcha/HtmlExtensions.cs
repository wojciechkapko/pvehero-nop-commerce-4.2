using System.Collections.Generic;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Nop.Core;
using Nop.Core.Domain.Security;
using Nop.Core.Infrastructure;
using Nop.Services.Localization;
using Nop.Services.Security;
using Nop.Web.Framework.Extensions;

namespace Nop.Web.Framework.Security.Captcha
{
    /// <summary>
    /// HTML extensions
    /// </summary>
    public static class HtmlExtensions
    {
        /// <summary>
        /// Generate reCAPTCHA Control
        /// </summary>
        /// <param name="helper">HTML helper</param>
        /// <returns>Result</returns>
        public static IHtmlContent GenerateCaptcha(this IHtmlHelper helper)
        {
            var captchaSettings = EngineContext.Current.Resolve<CaptchaSettings>();

            //prepare identifier
            var id = $"captcha_{CommonHelper.GenerateRandomInteger()}";

            //prepare public key
            var publicKey = captchaSettings.ReCaptchaPublicKey ?? string.Empty;

            //generate reCAPTCHA Control
            var scriptCallbackTag = new TagBuilder("script") { TagRenderMode = TagRenderMode.Normal };
            scriptCallbackTag.InnerHtml
                .AppendHtml($"function v3_onload() {{ console.log('v3 loaded'); }} function v3_callback(token) {{ console.log('v3 token: ' + token); }} function v3_get_token() {{grecaptcha.execute('{publicKey}').then(v3_callback);}};");

            var url = string.Format($"{NopSecurityDefaults.RecaptchaApiUrl}{NopSecurityDefaults.RecaptchaScriptPath}", publicKey);
            var scriptLoadApiTag = new TagBuilder("script") { TagRenderMode = TagRenderMode.Normal };
            scriptLoadApiTag.Attributes.Add("src", url);
            scriptLoadApiTag.Attributes.Add("async", null);
            scriptLoadApiTag.Attributes.Add("defer", null);

            return new HtmlString(scriptCallbackTag.RenderHtmlContent() + scriptLoadApiTag.RenderHtmlContent());
        }
    }
}