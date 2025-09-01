"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
exports.environment = {
    supabase: {
        url: 'https://tuzdzcecnfouvywngiko.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1emR6Y2VjbmZvdXZ5d25naWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTQxNDEsImV4cCI6MjA3MjIzMDE0MX0.lLvwkCBSxZ2TdxY7Wcj8-A4dBmv2Jcec0Kc6qgTyvIs',
    },
    database: {
        url: 'postgresql://postgres:ITAK-DB-2025@db.tuzdzcecnfouvywngiko.supabase.co:5432/postgres',
    },
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};
//# sourceMappingURL=environment.config.js.map