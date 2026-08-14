import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

function formatContent(raw: string): string {
  return raw
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('•')) return `<li>${trimmed.slice(1).trim()}</li>`;
      return `<p>${trimmed}</p>`;
    })
    .join('');
}

function wrapLists(html: string): string {
  return html.replace(/(<li>.*?<\/li>)+/gs, (match) => `<ul>${match}</ul>`);
}

function buildSectionsHtml(sections: { title: string; content: string }[]): string {
  return sections
    .map(
      (section, index) => `
      <div class="section-card">
        <div class="section-title-row">
          <span class="section-number">${index + 1}</span>
          <h2 class="section-title">${section.title}</h2>
        </div>
        <div class="section-content">${wrapLists(formatContent(section.content))}</div>
      </div>`,
    )
    .join('');
}

function buildHtmlPage(opts: {
  title: string;
  headerColor: string;
  headerShadow: string;
  numberGradient: string;
  logo: string;
  notice?: string;
  sections: { title: string; content: string }[];
}): string {
  const sectionsHtml = buildSectionsHtml(opts.sections);
  const noticeHtml = opts.notice ? `<div class="notice-card"><p class="notice-text">${opts.notice}</p></div>` : '';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${opts.title} — تطبيق ريشة</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      background: #f3f4f6;
      color: #111827;
      min-height: 100vh;
      padding: 24px 16px 48px;
    }

    .wrapper { max-width: 780px; margin: 0 auto; }

    .header-card {
      background: ${opts.headerColor};
      border-radius: 20px;
      padding: 36px 28px;
      text-align: center;
      margin-bottom: 24px;
      box-shadow: ${opts.headerShadow};
    }

    .header-logo {
      width: 64px; height: 64px; border-radius: 16px;
      background: rgba(255,255,255,0.2);
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 16px; font-size: 32px;
    }

    .header-title { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .header-date  { font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 6px; }
    .header-subtitle { font-size: 15px; color: rgba(255,255,255,0.9); }

    .notice-card {
      background: #fff8e1;
      border-radius: 12px;
      padding: 16px 18px;
      margin-bottom: 20px;
      border-right: 4px solid #4f46e5;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    .notice-text {
      font-size: 15px; font-weight: 500; color: #1f2937;
      line-height: 1.75; text-align: right;
    }

    .section-card {
      background: #fff;
      border-radius: 14px;
      padding: 20px 22px;
      margin-bottom: 14px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.07);
    }

    .section-title-row {
      display: flex; flex-direction: row-reverse;
      align-items: center; gap: 12px; margin-bottom: 12px;
    }

    .section-number {
      min-width: 30px; height: 30px; border-radius: 50%;
      background: ${opts.numberGradient};
      color: #fff; font-size: 13px; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .section-title { font-size: 17px; font-weight: 700; color: #111827; flex: 1; text-align: right; }

    .section-content { color: #374151; font-size: 15px; line-height: 1.8; text-align: right; }
    .section-content p { margin-bottom: 8px; }
    .section-content p:last-child { margin-bottom: 0; }
    .section-content ul { padding-right: 20px; margin: 8px 0; list-style: disc; }
    .section-content li { margin-bottom: 6px; }

    .footer { text-align: center; margin-top: 32px; color: #6b7280; font-size: 13px; }

    @media (max-width: 480px) {
      .header-title { font-size: 22px; }
      .section-card { padding: 16px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header-card">
      <div class="header-logo">${opts.logo}</div>
      <div class="header-title">${opts.title}</div>
      <div class="header-date">آخر تحديث: أغسطس 2026</div>
      <div class="header-subtitle">تطبيق ريشة </div>
    </div>

    ${noticeHtml}

    ${sectionsHtml}

    <div class="footer">© 2026 تطبيق ريشة — جميع الحقوق محفوظة</div>
  </div>
</body>
</html>`;
}

// ─── Privacy Policy data ─────────────────────────────────────────────────────

const PRIVACY_SECTIONS = [
  {
    title: 'المقدمة',
    content:
      'تلتزم شركة ريشة ("الشركة"، "نحن"، "لنا") بحماية خصوصية مستخدمي تطبيق ريشة ("التطبيق"). توضح سياسة الخصوصية هذه كيفية جمع معلوماتك الشخصية واستخدامها والإفصاح عنها وحمايتها وفقًا لأحكام قانون الاتصالات الكويتي رقم 23 لسنة 2007 واللوائح الصادرة عن هيئة تنظيم الاتصالات والملاحة والمعلومات (CITRA).',
  },
  {
    title: 'البيانات التي نجمعها',
    content:
      'نجمع الأنواع التالية من البيانات الشخصية:\n\n• بيانات الهوية: الاسم الكامل ورقم الهاتف والبريد الإلكتروني.\n• بيانات الاستخدام: معلومات عن كيفية تفاعلك مع التطبيق، والصفحات التي تزورها، والميزات التي تستخدمها.\n• بيانات الجهاز: نوع الجهاز ونظام التشغيل والمعرّفات الفريدة للجهاز.\n• بيانات الحمام: المعلومات التي تدخلها بشأن حماماتك وتركيباتك، وهي ملكك الحصري.',
  },
  {
    title: 'الغرض من جمع البيانات',
    content:
      'نستخدم بياناتك الشخصية للأغراض التالية:\n\n• تشغيل التطبيق وتحسين تجربتك فيه.\n• إرسال إشعارات ذات صلة بنشاطك داخل التطبيق.\n• دعم العملاء والرد على استفساراتك.\n• الوفاء بالالتزامات القانونية المفروضة علينا بموجب قانون التجارة الإلكترونية الكويتي رقم 20 لسنة 2014.\n• تحسين الميزات الحالية وتطوير ميزات جديدة.',
  },
  {
    title: 'مشاركة البيانات مع أطراف ثالثة',
    content:
      'نحن لا نبيع بياناتك الشخصية ولا نؤجرها لأي طرف ثالث. قد نشارك بياناتك في الحالات التالية حصرًا:\n\n• مع مزودي الخدمات التقنية الضروريين لتشغيل التطبيق، وذلك وفق عقود تحمي بياناتك.\n• استجابةً لأمر قضائي أو طلب رسمي من جهة حكومية كويتية مختصة.\n• في حالة الاندماج أو الاستحواذ، مع إخطارك مسبقًا.',
  },
  {
    title: 'حماية البيانات وأمانها',
    content:
      'نطبّق معايير أمنية تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرح به والتغيير والإفصاح أو الإتلاف. تُخزَّن البيانات في خوادم مؤمّنة وفق أفضل الممارسات الدولية، ونلتزم بإخطارك في حال وقوع أي اختراق أمني يؤثر على بياناتك.',
  },
  {
    title: 'حقوقك كمستخدم',
    content:
      'وفقًا للأنظمة المعمول بها في دولة الكويت، يحق لك:\n\n• الاطلاع على البيانات الشخصية المحفوظة لديك.\n• طلب تصحيح أي بيانات غير دقيقة.\n• طلب حذف بياناتك الشخصية ("الحق في النسيان") مع مراعاة المتطلبات القانونية.\n• سحب موافقتك على المعالجة في أي وقت.\n• تقديم شكوى إلى هيئة تنظيم الاتصالات والملاحة والمعلومات (CITRA).',
  },
  {
    title: 'ملفات تعريف الارتباط (Cookies) والتتبع',
    content:
      'يستخدم التطبيق تقنيات مماثلة لتحسين الأداء وتجربة الاستخدام. يمكنك التحكم في هذه التفضيلات من خلال إعدادات جهازك. لن يُؤثر إيقاف هذه التتبعات على الوظائف الأساسية للتطبيق.',
  },
  {
    title: 'الاحتفاظ بالبيانات',
    content:
      'نحتفظ ببياناتك الشخصية طوال مدة اشتراكك في التطبيق، وبعد إنهاء الحساب نحتفظ بها لمدة لا تتجاوز ثلاث (3) سنوات للوفاء بالالتزامات القانونية، ثم يتم حذفها نهائيًا بصورة آمنة.',
  },
  {
    title: 'خصوصية القاصرين',
    content:
      'التطبيق مخصص للمستخدمين الذين تجاوزوا سن الثامنة عشرة (18) عامًا. لا نجمع عن قصد بيانات شخصية تخص القاصرين. إن اكتشفنا ذلك، سنحذف تلك البيانات فورًا.',
  },
  {
    title: 'التعديلات على سياسة الخصوصية',
    content:
      'قد نُعدّل هذه السياسة من وقت لآخر. سنُخطرك بأي تغييرات جوهرية عبر التطبيق أو البريد الإلكتروني قبل سريانها بثلاثين (30) يومًا. استمرارك في استخدام التطبيق بعد هذه المدة يُعدّ قبولًا للتغييرات.',
  },
  {
    title: 'القانون المُطبَّق والاختصاص القضائي',
    content: 'تخضع هذه السياسة لأحكام قوانين دولة الكويت، ويختص القضاء الكويتي بالنظر في أي نزاع ينشأ عنها.',
  },
  {
    title: 'التواصل معنا',
    content:
      'لأي استفسار أو طلب يتعلق بسياسة الخصوصية، يرجى التواصل معنا عبر:\nالبريد الإلكتروني: privacy@risha-app.com\nالعنوان: دولة الكويت',
  },
];

// ─── Terms & Conditions data ──────────────────────────────────────────────────

const TERMS_SECTIONS = [
  {
    title: 'القبول والموافقة',
    content:
      'باستخدامك لتطبيق ريشة ("التطبيق") أو تسجيل حساب فيه، فإنك توافق صراحةً على الالتزام بهذه الشروط والأحكام وجميع السياسات المشار إليها فيها. إن كنت لا توافق على أي من هذه البنود، فيرجى الامتناع عن استخدام التطبيق. تسري هذه الشروط وفق أحكام قانون التجارة الإلكترونية الكويتي رقم 20 لسنة 2014 وقانون المعاملات الإلكترونية.',
  },
  {
    title: 'وصف الخدمة',
    content:
      'تطبيق ريشة هو منصة رقمية مخصصة لهواة تربية الحمام في دولة الكويت ومنطقة الخليج العربي، تُتيح لك:\n\n• إدارة قائمة حماماتك وسجلاتها بالكامل.\n• إنشاء تركيبات التزاوج ومتابعة نتائجها.\n• حفظ التطعيمات والسجلات الصحية.\n• متابعة أخبار الهواية والمزادات والمباريات.\n• مشاركة بيانات الحمام بصورة آمنة.',
  },
  {
    title: 'شروط الاشتراك وإنشاء الحساب',
    content:
      'لاستخدام التطبيق يجب أن:\n\n• يبلغ عمرك ثمانية عشر (18) عامًا على الأقل.\n• تقدم معلومات صحيحة ودقيقة عند التسجيل.\n• تحافظ على سرية بيانات تسجيل الدخول الخاصة بك.\n• تكون مسؤولًا عن جميع الأنشطة التي تجري تحت حسابك.\n• تُخطرنا فورًا في حال الاشتباه بوصول غير مصرح به لحسابك.',
  },
  {
    title: 'الاستخدام المقبول',
    content:
      'يحق لك استخدام التطبيق للأغراض المشروعة المتعلقة بهواية تربية الحمام فحسب. يُحظر عليك:\n\n• انتهاك أي قانون كويتي أو دولي سارٍ.\n• نشر محتوى مسيء أو مضلل أو مخالف للآداب العامة.\n• محاولة الوصول غير المصرح به لأنظمة التطبيق أو قواعد بياناته.\n• إساءة استخدام ميزات المشاركة لأغراض تجارية غير مرخصة.\n• نسخ أو توزيع أو إعادة بيع أي جزء من خدمات التطبيق.',
  },
  {
    title: 'المحتوى الذي ينشئه المستخدمون وسياسة عدم التسامح',
    content:
      'يعتمد تطبيق ريشة سياسة عدم تسامح مطلقاً مع المحتوى المسيء أو المضلّل أو المخالف للآداب، ومع المستخدمين المسيئين. يجب الموافقة على هذه الشروط قبل إنشاء حساب أو تسجيل الدخول.\n\n• يُفلتر المحتوى المسيء ويُمنع نشره في التطبيق.\n• يمكنك الإبلاغ عن أي منشور مسيء عبر زر الإبلاغ في الأخبار؛ يُخفى المنشور من خلاصتك فوراً.\n• يمكنك حظر أي مستخدم مسيء؛ تختفي منشوراته من خلاصتك فوراً.\n• نراجع كل بلاغ ونزيل المحتوى المسيء ونوقف الحساب المخالف خلال أربع وعشرين (24) ساعة من استلام البلاغ.\n• يتلقى فريق ريشة إشعاراً فورياً بكل بلاغ على legal@risha-app.com.',
  },
  {
    title: 'الملكية الفكرية',
    content:
      'جميع حقوق الملكية الفكرية المتعلقة بالتطبيق، بما فيها البرمجيات والتصاميم والشعارات والمحتوى، مملوكة لشركة ريشة وخاضعة لحماية قوانين الملكية الفكرية الكويتية والدولية. تحتفظ أنت بملكية كاملة على بيانات حماماتك وتركيباتك التي تدخلها في التطبيق.',
  },
  {
    title: 'الرسوم والاشتراكات',
    content:
      'قد يوفر التطبيق خططًا مجانية ومدفوعة. ستُوضَّح رسوم الاشتراكات المدفوعة بشكل صريح قبل إتمام أي معاملة مالية. تخضع جميع المعاملات لأحكام قانون حماية المستهلك الكويتي رقم 39 لسنة 2014. لا يحق استرداد الرسوم إلا في الحالات المنصوص عليها في هذا القانون.',
  },
  {
    title: 'إخلاء المسؤولية وحدود الضمان',
    content:
      'يُقدَّم التطبيق "كما هو" دون أي ضمانات صريحة أو ضمنية. لا تتحمل شركة ريشة مسؤولية:\n\n• دقة المعلومات التي يدخلها المستخدمون.\n• أي خسائر تجارية أو أضرار غير مباشرة تنشأ عن استخدام التطبيق.\n• انقطاعات الخدمة الناتجة عن أعطال تقنية خارجة عن إرادتنا.\n• قرارات تربية الحمام المبنية على بيانات التطبيق.',
  },
  {
    title: 'تعليق الحساب وإنهاؤه',
    content:
      'يحق لنا تعليق حسابك أو إنهاؤه في الحالات التالية:\n\n• انتهاك هذه الشروط والأحكام.\n• تقديم معلومات مزيفة أو مضللة عند التسجيل.\n• استخدام التطبيق بطريقة تضر بمستخدمين آخرين أو بالشركة، بما في ذلك نشر محتوى مسيء.\n\nنلتزم بإزالة المحتوى المسيء وإيقاف الحساب المخالف خلال أربع وعشرين (24) ساعة من استلام البلاغ. يحق لك أيضاً إنهاء حسابك في أي وقت عبر إعدادات التطبيق مع الاحتفاظ بنسخة من بياناتك.',
  },
  {
    title: 'التعديلات على الشروط',
    content:
      'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستُخطَر بالتعديلات الجوهرية عبر التطبيق أو البريد الإلكتروني قبل ثلاثين (30) يومًا من سريانها. استمرارك في استخدام التطبيق بعد هذه المدة يُعدّ قبولًا للشروط المعدّلة.',
  },
  {
    title: 'الخصوصية وحماية البيانات',
    content:
      'تخضع معالجة بياناتك الشخصية لسياسة الخصوصية الخاصة بنا وللوائح هيئة تنظيم الاتصالات والملاحة والمعلومات (CITRA). يرجى الاطلاع على سياسة الخصوصية لمعرفة تفاصيل كيفية حماية بياناتك.',
  },
  {
    title: 'القانون الحاكم وتسوية النزاعات',
    content:
      'تخضع هذه الشروط والأحكام لأحكام قوانين دولة الكويت. في حال نشوء أي نزاع، يُحال أولًا للتسوية الودية خلال ثلاثين (30) يومًا، وعند تعذّر ذلك يُحال إلى المحاكم الكويتية المختصة وفق قواعد الاختصاص المعمول بها.',
  },
  {
    title: 'التواصل معنا',
    content:
      'لأي استفسار أو شكوى تتعلق بهذه الشروط، يرجى التواصل معنا:\nالبريد الإلكتروني: legal@risha-app.com\nالعنوان: دولة الكويت',
  },
];

// ─── Controller ───────────────────────────────────────────────────────────────

@ApiExcludeController()
@Controller('legal')
export class LegalController {
  @Get('privacy-policy')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getPrivacyPolicy(): string {
    return buildHtmlPage({
      title: 'سياسة الخصوصية',
      logo: '🪶',
      headerColor: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      headerShadow: '0 8px 30px rgba(79, 70, 229, 0.35)',
      numberGradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      sections: PRIVACY_SECTIONS,
    });
  }

  @Get('terms-and-conditions')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getTermsAndConditions(): string {
    return buildHtmlPage({
      title: 'الشروط والأحكام',
      logo: '📋',
      headerColor: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
      headerShadow: '0 8px 30px rgba(17, 24, 39, 0.4)',
      numberGradient: 'linear-gradient(135deg, #111827, #374151)',
      notice:
        'يُرجى قراءة هذه الشروط والأحكام بعناية والموافقة عليها قبل تسجيل الدخول أو إنشاء حساب. يعتمد تطبيق ريشة سياسة عدم تسامح مطلقاً مع المحتوى المسيء ومع المستخدمين المسيئين، ونزيل المحتوى المخالف خلال 24 ساعة.',
      sections: TERMS_SECTIONS,
    });
  }
}
