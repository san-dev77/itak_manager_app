"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../config/supabase.config");
let SupabaseService = class SupabaseService {
    async getData(table, select = '*') {
        const { data, error } = await supabase_config_1.supabase.from(table).select(select);
        if (error)
            throw error;
        return data;
    }
    async insertData(table, data) {
        const { data: result, error } = await supabase_config_1.supabase
            .from(table)
            .insert(data)
            .select();
        if (error)
            throw error;
        return result;
    }
    async updateData(table, data, match) {
        const { data: result, error } = await supabase_config_1.supabase
            .from(table)
            .update(data)
            .match(match)
            .select();
        if (error)
            throw error;
        return result;
    }
    async deleteData(table, match) {
        const { error } = await supabase_config_1.supabase.from(table).delete().match(match);
        if (error)
            throw error;
        return { success: true };
    }
    async getDataById(table, id) {
        const { data, error } = await supabase_config_1.supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)()
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map