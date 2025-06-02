// .eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // Adicione a configuração do Prettier aqui se você usa o 'plugin:prettier/recommended'
  // Você precisará instalar o plugin 'eslint-plugin-prettier' e 'eslint-config-prettier'
  // se ainda não o fez.
  // Você já tem 'plugin:prettier/recommended' no seu .eslintrc.json, então é provável
  // que você já tenha instalado eles.
  // Certifique-se de que esses pacotes estão instalados:
  // npm install --save-dev eslint-plugin-prettier eslint-config-prettier
});

const eslintConfig = [
  {
    ignores: [
      '**/*.test.js',
      '**/*.test.jsx',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/__tests__/**/*',
      // Adicione aqui a pasta .next para ignorar arquivos gerados se não estiverem já configurados em outro lugar
      '.next/**/*',
    ],
  },
  // As configurações estendidas do Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Adicione o plugin do Prettier e as regras de recomendado
  // Se você tem plugin:prettier/recommended, ele já lida com as regras
  ...compat.extends("plugin:prettier/recommended"), // Adicione esta linha para integrar o Prettier
  
  // Objeto de configuração para suas regras personalizadas
  {
    rules: {
      // Regras do Prettier. "error" é o padrão para "prettier/prettier".
      // Se você não usa "prettier/prettier", pode remover esta linha.
      "prettier/prettier": "error", 
      
      // Regras para variáveis não utilizadas
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        {
          "argsIgnorePattern": "^_", 
          "varsIgnorePattern": "^_",  
          "caughtErrorsIgnorePattern": "^_" 
        }
      ],
      // Desativa a regra padrão do ESLint para evitar conflito com a do TypeScript
      "no-unused-vars": "off", 
      
      // Regra para uso explícito de 'any'
      "@typescript-eslint/no-explicit-any": "warn" // Você pode mudar para "off" se o build ainda der erro de 'any'
    }
  }
];

export default eslintConfig;