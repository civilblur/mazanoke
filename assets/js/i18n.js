// i18n.js - Simple multi-language support system

window.App = window.App || {};
App.i18n = {
  currentLang: 'en',
  defaultLang: 'en',
  dataAttrName: 'data-i18n',
  
  languageNames: {
    'en': 'English',
    'zh': '简体中文',
    'ja': '日本語',
    'es': 'Español'
  },
  
  translations: {
    'en': {
      'app.title': 'MAZANOKE | Online Image Optimizer That Runs Privately in Your Browser',
      'app.description': 'Optimize images locally and privately by converting and compressing them offline in your browser. Supports JPG, PNG, WebP, HEIC, AVIF, GIF, SVG.',
      'nav.install': 'Install',
      'drop.title': 'Drop or paste images',
      'drop.formats': '<span>jpg</span><span>png</span><span>webp</span><span>heic</span><span>avif</span><span>gif</span><span>svg</span>',
      'button.browse': 'Browse',
      'button.cancel': 'Cancel',
      'nav.settings': 'Settings',
      'nav.images': 'Images',
      'settings.title': 'Settings',
      'settings.description': 'Images are processed locally on your device, ensuring privacy.',
      'settings.optimization.title': 'Optimization method',
      'settings.optimization.quality.title': 'Set image quality',
      'settings.optimization.quality.description': 'Higher values retain more detail, while lower values result in smaller file sizes.',
      'settings.optimization.limit.title': 'Limit file size',
      'settings.optimization.limit.description': 'Compress the image to a target file size.',
      'settings.quality.label': 'Quality',
      'settings.filesize.label': 'Target file size',
      'settings.filesize.megabytes': 'Megabytes (MB)',
      'settings.filesize.kilobytes': 'Kilobytes (KB)',
      'settings.dimensions.title': 'Dimensions',
      'settings.dimensions.original.title': 'Keep original dimensions',
      'settings.dimensions.original.description': 'Do not alter the width and height of the image.',
      'settings.dimensions.limit.title': 'Limit dimensions',
      'settings.dimensions.limit.description': 'Limit the width and height of the image.',
      'settings.dimensions.limit.label': 'Limit dimensions',
      'settings.format.title': 'Convert to',
      'settings.format.default.title': 'Default',
      'settings.format.default.description': '<div class="flex flex-col gap-3xs"><div>• JPG, PNG, WebP → Unchanged.</div><div>• HEIC, AVIF, GIF, SVG → PNG.</div></div>',
      'settings.format.jpg': 'JPG',
      'settings.format.png': 'PNG',
      'settings.format.webp': 'WebP',
      'output.title': 'Images',
      'output.description': 'Optimized images ready for review and download.',
      'output.delete.all': 'Delete all',
      'output.download.all': 'Download all',
      'output.download': 'Download',
      'output.empty.title': 'No image optimized yet',
      'output.empty.description': 'Upload images above to optimize them. Once compressed, they\'ll appear here.',
      'process.optimizing': 'Optimizing',
      'process.preparing': 'Preparing',
      'process.done': 'Done!',
      'install.title': 'Install MAZANOKE',
      'install.feature1': 'An app shortcut is added to your device.',
      'install.feature2': 'Use even without an internet connection.',
      'install.feature3': 'Whether on the web or app, your images are always processed privately on-device.',
      'update.title': 'Update available',
      'update.message': 'Refresh the page to update.',
      'update.ignore': 'Ignore',
      'update.refresh': 'Refresh',
      'footer.created': 'created by civilblur'
    },
    'zh': {
      'app.title': 'MAZANOKE | 在您的浏览器中私密运行的在线图像优化工具',
      'app.description': '通过在浏览器中离线转换和压缩图像，在本地和私密地优化图像。支持JPG、PNG、WebP、HEIC、AVIF、GIF、SVG。',
      'nav.install': '安装',
      'drop.title': '拖放或粘贴图像',
      'drop.formats': '<span>jpg</span><span>png</span><span>webp</span><span>heic</span><span>avif</span><span>gif</span><span>svg</span>',
      'button.browse': '选择文件',
      'button.cancel': '取消',
      'nav.settings': '设置',
      'nav.images': '图像',
      'settings.title': '设置',
      'settings.description': '图像在您的设备上本地处理，确保隐私安全。',
      'settings.optimization.title': '优化方法',
      'settings.optimization.quality.title': '设置图像质量',
      'settings.optimization.quality.description': '更高的值保留更多细节，而更低的值会产生更小的文件大小。',
      'settings.optimization.limit.title': '限制文件大小',
      'settings.optimization.limit.description': '将图像压缩到目标文件大小。',
      'settings.quality.label': '质量',
      'settings.filesize.label': '目标文件大小',
      'settings.filesize.megabytes': '兆字节 (MB)',
      'settings.filesize.kilobytes': '千字节 (KB)',
      'settings.dimensions.title': '尺寸',
      'settings.dimensions.original.title': '保持原始尺寸',
      'settings.dimensions.original.description': '不改变图像的宽度和高度。',
      'settings.dimensions.limit.title': '限制尺寸',
      'settings.dimensions.limit.description': '限制图像的宽度和高度。',
      'settings.dimensions.limit.label': '限制尺寸',
      'settings.format.title': '转换为',
      'settings.format.default.title': '默认',
      'settings.format.default.description': '<div class="flex flex-col gap-3xs"><div>• JPG, PNG, WebP → 保持不变。</div><div>• HEIC, AVIF, GIF, SVG → PNG。</div></div>',
      'settings.format.jpg': 'JPG',
      'settings.format.png': 'PNG',
      'settings.format.webp': 'WebP',
      'output.title': '图像',
      'output.description': '优化后的图像可供预览和下载。',
      'output.delete.all': '全部删除',
      'output.download.all': '全部下载',
      'output.download': '下载',
      'output.empty.title': '尚未优化图像',
      'output.empty.description': '在上方上传图像以优化它们。压缩后，它们将出现在这里。',
      'process.optimizing': '优化中',
      'process.preparing': '准备中',
      'process.done': '完成！',
      'install.title': '安装 MAZANOKE',
      'install.feature1': '应用快捷方式将添加到您的设备。',
      'install.feature2': '即使没有互联网连接也可以使用。',
      'install.feature3': '无论是在网页还是应用程序中，您的图像始终在设备上私密处理。',
      'update.title': '更新可用',
      'update.message': '刷新页面以更新。',
      'update.ignore': '忽略',
      'update.refresh': '刷新',
      'footer.created': '由 civilblur 创建'
    },
    'ja': {
      'app.title': 'MAZANOKE | ブラウザでプライベートに実行されるオンライン画像最適化ツール',
      'app.description': 'ブラウザでオフラインで画像を変換・圧縮して、ローカルでプライベートに最適化します。JPG、PNG、WebP、HEIC、AVIF、GIF、SVGに対応。',
      'nav.install': 'インストール',
      'drop.title': '画像をドロップまたは貼り付け',
      'drop.formats': '<span>jpg</span><span>png</span><span>webp</span><span>heic</span><span>avif</span><span>gif</span><span>svg</span>',
      'button.browse': '参照',
      'button.cancel': 'キャンセル',
      'nav.settings': '設定',
      'nav.images': '画像',
      'settings.title': '設定',
      'settings.description': '画像はデバイス上でローカルに処理され、プライバシーが確保されます。',
      'settings.optimization.title': '最適化方法',
      'settings.optimization.quality.title': '画像品質を設定',
      'settings.optimization.quality.description': '高い値はより多くの詳細を保持し、低い値はより小さいファイルサイズになります。',
      'settings.optimization.limit.title': 'ファイルサイズを制限',
      'settings.optimization.limit.description': '画像を目標ファイルサイズに圧縮します。',
      'settings.quality.label': '品質',
      'settings.filesize.label': '目標ファイルサイズ',
      'settings.filesize.megabytes': 'メガバイト (MB)',
      'settings.filesize.kilobytes': 'キロバイト (KB)',
      'settings.dimensions.title': '寸法',
      'settings.dimensions.original.title': '元の寸法を維持',
      'settings.dimensions.original.description': '画像の幅と高さを変更しません。',
      'settings.dimensions.limit.title': '寸法を制限',
      'settings.dimensions.limit.description': '画像の幅と高さを制限します。',
      'settings.dimensions.limit.label': '寸法を制限',
      'settings.format.title': '変換先',
      'settings.format.default.title': 'デフォルト',
      'settings.format.default.description': '<div class="flex flex-col gap-3xs"><div>• JPG, PNG, WebP → 変更なし。</div><div>• HEIC, AVIF, GIF, SVG → PNG。</div></div>',
      'settings.format.jpg': 'JPG',
      'settings.format.png': 'PNG',
      'settings.format.webp': 'WebP',
      'output.title': '画像',
      'output.description': '最適化された画像をレビューとダウンロードの準備ができています。',
      'output.delete.all': 'すべて削除',
      'output.download.all': 'すべてダウンロード',
      'output.download': 'ダウンロード',
      'output.empty.title': 'まだ最適化された画像はありません',
      'output.empty.description': '上記で画像をアップロードして最適化します。圧縮後、ここに表示されます。',
      'process.optimizing': '最適化中',
      'process.preparing': '準備中',
      'process.done': '完了！',
      'install.title': 'MAZANOKEをインストール',
      'install.feature1': 'アプリのショートカットがデバイスに追加されます。',
      'install.feature2': 'インターネット接続がなくても使用できます。',
      'install.feature3': 'ウェブでもアプリでも、画像は常にデバイス上でプライベートに処理されます。',
      'update.title': '更新があります',
      'update.message': 'ページを更新して更新します。',
      'update.ignore': '無視',
      'update.refresh': '更新',
      'footer.created': 'civilblur によって作成'
    },
    'es': {
      'app.title': 'MAZANOKE | Optimizador de imágenes en línea que se ejecuta de forma privada en su navegador',
      'app.description': 'Optimice imágenes de forma local y privada convirtiéndolas y comprimiéndolas sin conexión en su navegador. Compatible con JPG, PNG, WebP, HEIC, AVIF, GIF, SVG.',
      'nav.install': 'Instalar',
      'drop.title': 'Suelte o pegue imágenes',
      'drop.formats': '<span>jpg</span><span>png</span><span>webp</span><span>heic</span><span>avif</span><span>gif</span><span>svg</span>',
      'button.browse': 'Explorar',
      'button.cancel': 'Cancelar',
      'nav.settings': 'Ajustes',
      'nav.images': 'Imágenes',
      'settings.title': 'Ajustes',
      'settings.description': 'Las imágenes se procesan localmente en su dispositivo, garantizando la privacidad.',
      'settings.optimization.title': 'Método de optimización',
      'settings.optimization.quality.title': 'Establecer calidad de imagen',
      'settings.optimization.quality.description': 'Los valores más altos conservan más detalles, mientras que los valores más bajos resultan en tamaños de archivo más pequeños.',
      'settings.optimization.limit.title': 'Limitar tamaño de archivo',
      'settings.optimization.limit.description': 'Comprimir la imagen a un tamaño de archivo objetivo.',
      'settings.quality.label': 'Calidad',
      'settings.filesize.label': 'Tamaño de archivo objetivo',
      'settings.filesize.megabytes': 'Megabytes (MB)',
      'settings.filesize.kilobytes': 'Kilobytes (KB)',
      'settings.dimensions.title': 'Dimensiones',
      'settings.dimensions.original.title': 'Mantener dimensiones originales',
      'settings.dimensions.original.description': 'No alterar el ancho y alto de la imagen.',
      'settings.dimensions.limit.title': 'Limitar dimensiones',
      'settings.dimensions.limit.description': 'Limitar el ancho y alto de la imagen.',
      'settings.dimensions.limit.label': 'Limitar dimensiones',
      'settings.format.title': 'Convertir a',
      'settings.format.default.title': 'Predeterminado',
      'settings.format.default.description': '<div class="flex flex-col gap-3xs"><div>• JPG, PNG, WebP → Sin cambios.</div><div>• HEIC, AVIF, GIF, SVG → PNG.</div></div>',
      'settings.format.jpg': 'JPG',
      'settings.format.png': 'PNG',
      'settings.format.webp': 'WebP',
      'output.title': 'Imágenes',
      'output.description': 'Imágenes optimizadas listas para revisión y descarga.',
      'output.delete.all': 'Eliminar todo',
      'output.download.all': 'Descargar todo',
      'output.download': 'Descargar',
      'output.empty.title': 'Ninguna imagen optimizada aún',
      'output.empty.description': 'Suba imágenes arriba para optimizarlas. Una vez comprimidas, aparecerán aquí.',
      'process.optimizing': 'Optimizando',
      'process.preparing': 'Preparando',
      'process.done': '¡Listo!',
      'install.title': 'Instalar MAZANOKE',
      'install.feature1': 'Se añade un acceso directo a la aplicación en su dispositivo.',
      'install.feature2': 'Úselo incluso sin conexión a Internet.',
      'install.feature3': 'Ya sea en la web o en la aplicación, sus imágenes siempre se procesan de forma privada en el dispositivo.',
      'update.title': 'Actualización disponible',
      'update.message': 'Actualice la página para actualizar.',
      'update.ignore': 'Ignorar',
      'update.refresh': 'Actualizar',
      'footer.created': 'creado por civilblur'
    }
  },

  storage: {
    get: function(key) {
      return localStorage.getItem(key);
    },
    set: function(key, value) {
      localStorage.setItem(key, value);
    }
  },

  // Initialize i18n system
  init: function() {
    const savedLang = this.storage.get('language');
    if (savedLang && this.translations[savedLang]) {
      this.currentLang = savedLang;
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (this.translations[browserLang]) {
        this.currentLang = browserLang;
      }
    }
    
    this.applyLanguage(this.currentLang);
    this.updateLanguageSelector();
  },
  
  // Switch language
  setLanguage: function(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      this.storage.set('language', lang);
      this.applyLanguage(lang);
      this.updateLanguageSelector();
      
      this.updateAllLanguageOptions(lang);
    }
  },
  
  // Update all language options active state
  updateAllLanguageOptions: function(lang) {
    const langOptions = document.querySelectorAll('.language-selector__option');
    langOptions.forEach(option => {
      const optionLang = option.getAttribute('data-lang');
      if (optionLang === lang) {
        option.classList.add('language-selector__option--active');
      } else {
        option.classList.remove('language-selector__option--active');
      }
    });
  },
  
  // Update language selector state
  updateLanguageSelector: function() {
    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
      const currentLangElement = document.getElementById('currentLanguage');
      if (currentLangElement) {
        currentLangElement.textContent = this.languageNames[this.currentLang] || this.languageNames[this.defaultLang];
      }
      
      this.updateAllLanguageOptions(this.currentLang);
    }
  },
  
  // Apply language to UI
  applyLanguage: function(lang) {
    // Update title and description
    document.title = this.getTranslation('app.title', lang);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', this.getTranslation('app.description', lang));
    }
    
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll(`[${this.dataAttrName}]`);
    elements.forEach(el => {
      const key = el.getAttribute(this.dataAttrName);
      const text = this.getTranslation(key, lang);
      
      // Check if it is HTML content
      if (text.includes('<') && text.includes('>')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });
    
    // Update all select options
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
      Array.from(select.options).forEach(option => {
        const i18nKey = option.getAttribute(this.dataAttrName);
        if (i18nKey) {
          option.textContent = this.getTranslation(i18nKey, lang);
        }
      });
    });
    
    document.documentElement.setAttribute('lang', lang);
  },
  
  // Get the translated text
  getTranslation: function(key, lang) {
    lang = lang || this.currentLang;
    
    if (this.translations[lang] && this.translations[lang][key]) {
      return this.translations[lang][key];
    } 
    else if (this.translations[this.defaultLang] && this.translations[this.defaultLang][key]) {
      return this.translations[this.defaultLang][key];
    }
    
    return key;
  },
  
  // Add new language support
  addLanguage: function(langCode, langName, translations) {
    if (langCode && translations) {
      this.translations[langCode] = translations;
      this.languageNames[langCode] = langName || langCode;
      return true;
    }
    return false;
  },
  
  // Configure i18n system
  configure: function(options) {
    if (options.defaultLang) this.defaultLang = options.defaultLang;
    if (options.dataAttrName) this.dataAttrName = options.dataAttrName;
    if (options.storage) this.storage = options.storage;
  }
};

// Global function to get translations
function i18n(key) {
  return App.i18n.getTranslation(key);
} 