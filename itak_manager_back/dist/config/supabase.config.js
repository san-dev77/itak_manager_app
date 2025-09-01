"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.supabaseConfig = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const environment_config_1 = require("./environment.config");
exports.supabaseConfig = {
    url: environment_config_1.environment.supabase.url,
    key: environment_config_1.environment.supabase.anonKey,
};
console.log('✅ Configuration Supabase chargée avec succès');
exports.supabase = (0, supabase_js_1.createClient)(exports.supabaseConfig.url, exports.supabaseConfig.key);
//# sourceMappingURL=supabase.config.js.map