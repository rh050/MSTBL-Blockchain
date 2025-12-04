# PowerShell script to add usefulInfo translations

$translations = @{
    "ar" = @"
    },
    "usefulInfo": {
      "title": "💡 معلومات مفيدة:",
      "nativeToken": "Native MSTBL - يظهر تلقائيًا ويستخدم لرسوم المعاملات",
      "cw20Token": "CW20 MSTBL - الرموز الرئيسية، تتطلب إضافة يدوية",
      "bothImportant": "كلا نوعي الرمز مهمان لاستخدام النظام"
    }
"@
    "es" = @"
    },
    "usefulInfo": {
      "title": "💡 Información Útil:",
      "nativeToken": "Native MSTBL - Aparece automáticamente y se usa para tarifas de transacción",
      "cw20Token": "CW20 MSTBL - Los tokens principales, requieren adición manual",
      "bothImportant": "Ambos tipos de token son importantes para usar el sistema"
    }
"@
    "fr" = @"
    },
    "usefulInfo": {
      "title": "💡 Informations Utiles:",
      "nativeToken": "Native MSTBL - Apparaît automatiquement et est utilisé pour les frais de transaction",
      "cw20Token": "CW20 MSTBL - Les tokens principaux, nécessitent une ajout manuel",
      "bothImportant": "Les deux types de tokens sont importants pour utiliser le système"
    }
"@
    "de" = @"
    },
    "usefulInfo": {
      "title": "💡 Nützliche Informationen:",
      "nativeToken": "Native MSTBL - Erscheint automatisch und wird für Transaktionsgebühren verwendet",
      "cw20Token": "CW20 MSTBL - Die Haupttoken, erfordern manuelle Hinzufügung",
      "bothImportant": "Beide Token-Typen sind wichtig für die Nutzung des Systems"
    }
"@
    "it" = @"
    },
    "usefulInfo": {
      "title": "💡 Informazioni Utili:",
      "nativeToken": "Native MSTBL - Appare automaticamente ed è utilizzato per le commissioni di transazione",
      "cw20Token": "CW20 MSTBL - I token principali, richiedono aggiunta manuale",
      "bothImportant": "Entrambi i tipi di token sono importanti per utilizzare il sistema"
    }
"@
    "pt" = @"
    },
    "usefulInfo": {
      "title": "💡 Informações Úteis:",
      "nativeToken": "Native MSTBL - Aparece automaticamente e é usado para taxas de transação",
      "cw20Token": "CW20 MSTBL - Os tokens principais, requerem adição manual",
      "bothImportant": "Ambos os tipos de token são importantes para usar o sistema"
    }
"@
    "ru" = @"
    },
    "usefulInfo": {
      "title": "💡 Полезная Информация:",
      "nativeToken": "Native MSTBL - Появляется автоматически и используется для комиссий за транзакции",
      "cw20Token": "CW20 MSTBL - Основные токены, требуют ручного добавления",
      "bothImportant": "Оба типа токенов важны для использования системы"
    }
"@
    "ja" = @"
    },
    "usefulInfo": {
      "title": "💡 役立つ情報:",
      "nativeToken": "Native MSTBL - 自動的に表示され、取引手数料に使用されます",
      "cw20Token": "CW20 MSTBL - メイントークン、手動での追加が必要です",
      "bothImportant": "両方のトークンタイプはシステムを使用するために重要です"
    }
"@
    "ko" = @"
    },
    "usefulInfo": {
      "title": "💡 유용한 정보:",
      "nativeToken": "Native MSTBL - 자동으로 나타나며 거래 수수료에 사용됩니다",
      "cw20Token": "CW20 MSTBL - 주요 토큰, 수동 추가가 필요합니다",
      "bothImportant": "두 토큰 유형 모두 시스템 사용에 중요합니다"
    }
"@
    "zh" = @"
    },
    "usefulInfo": {
      "title": "💡 有用信息:",
      "nativeToken": "Native MSTBL - 自动显示并用于交易费用",
      "cw20Token": "CW20 MSTBL - 主要代币，需要手动添加",
      "bothImportant": "两种代币类型对于使用系统都很重要"
    }
"@
}

Write-Host "Adding usefulInfo translations..." -ForegroundColor Green

foreach ($locale in $translations.Keys) {
    $filePath = ".\public\locales\$locale\common.json"

    if (Test-Path $filePath) {
        Write-Host "Updating $locale..." -ForegroundColor Yellow

        # Read the file
        $content = Get-Content $filePath -Raw

        # Find the position to insert (after alerts closing brace and before cw20Guide closing)
        $pattern = '      "copied": ".*?"\s*\}\s*\}'

        if ($content -match $pattern) {
            $replacement = $matches[0].Replace('    }', $translations[$locale] + "`n  }")
            $content = $content -replace [regex]::Escape($matches[0]), $replacement

            # Write back to file
            Set-Content -Path $filePath -Value $content -NoNewline

            Write-Host "✅ $locale updated successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Pattern not found in $locale" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  File not found: $filePath" -ForegroundColor Red
    }
}

Write-Host "`n✅ All usefulInfo translations updated!" -ForegroundColor Green
