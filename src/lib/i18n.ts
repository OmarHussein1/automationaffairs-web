import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    common: {
      nav: {
        home: 'Home',
        about: 'About',
        contact: 'Contact',
        getInTouch: 'Get in Touch',
      },
      a11y: {
        skipToContent: 'Skip to main content',
        toggleTheme: 'Toggle theme',
        toggleLanguage: 'Toggle language',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
      },
      footer: {
        email: 'hello@automationaffairs.com',
        social: {
          linkedin: 'LinkedIn',
          youtube: 'YouTube',
        },
        legal: {
          impressum: 'Imprint',
          privacy: 'Privacy Policy',
          cookies: 'Cookie Settings',
        },
      },
      cookies: {
        title: 'We use cookies',
        description: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
        customize: 'Customize',
        necessary: 'Necessary Only',
        acceptAll: 'Accept All',
        preferences: 'Cookie Preferences',
        required: 'Required',
        savePreferences: 'Save Preferences',
        categories: {
          necessary: {
            title: 'Necessary Cookies',
            description: 'These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.',
          },
          analytics: {
            title: 'Analytics Cookies',
            description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
          },
          marketing: {
            title: 'Marketing Cookies',
            description: 'These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.',
          },
          functional: {
            title: 'Functional Cookies',
            description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
          },
        },
      },
      seo: {
        siteName: 'Automation Affairs',
        defaultTitle: 'Automation Affairs - Your Transformation Partner for AI & Automation',
        defaultDescription: 'We help businesses transform through intelligent automation and AI integration. Specializing in AI agents, RAG systems, workflow automation, API integrations, and self-hosted AI solutions.',
        defaultKeywords: 'automation, AI, artificial intelligence, workflow automation, API integration, RAG systems, AI agents, business transformation, GDPR compliant AI',
        home: {
          title: 'Your Transformation Partner for AI & Automation',
          description: 'Transform your business with intelligent automation and AI integration. We build AI agents, RAG systems, workflow automation, and API integrations that deliver real ROI.',
          keywords: 'AI automation, business transformation, AI agents, RAG systems, workflow automation, API integration, self-hosted AI'
        },
        about: {
          title: 'About Us - Expert AI & Automation Team',
          description: 'Meet our specialized team of automation engineers, AI developers, and business strategists. Learn about our mission, vision, and approach to enterprise transformation.',
          keywords: 'automation team, AI experts, business strategists, enterprise transformation, technical excellence'
        },
        contact: {
          title: 'Contact Us - Start Your Automation Journey',
          description: 'Ready to transform your business with AI and automation? Get in touch with our experts to discuss your automation needs and explore what\'s possible.',
          keywords: 'contact automation experts, AI consultation, automation consultation, business transformation inquiry'
        }
      },
    },
    home: {
      hero: {
        title: 'AUTOMATION\nAFFAIRS',
        subtitle: 'Cut the noise. Build what matters.',
        primaryCta: 'Get in Touch',
        secondaryCta: 'See How We Work',
      },
      whatWeDo: {
        title: 'Make AI a tool, not a gamble.',
        description: 'We cut through the AI noise and focus on what matters: More efficient workflows. We map critical processes, connect the right tools, and ship automations and agents that augment your team. Clean builds, clear docs, and privacy-conscious delivery—reliable systems, not experiments.',
      },
      process: {
        title: 'How we Work',
        subtitle: 'Three focused steps to transform your operations',
        steps: {
          scope: {
            title: 'Scope',
            description: 'Define goals and map workflows.',
            icon: '🎯'
          },
          identify: {
            title: 'Identify',
            description: 'Spot inefficiencies and set priorities.',
            icon: '🔍'
          },
          build: {
            title: 'Build',
            description: 'Design, connect, and deliver automation.',
            icon: '🔧'
          },
        },
      },
      testimonials: {
        title: 'What Our Clients Say',
        subtitle: 'Real results from real partnerships',
        items: [
          {
            quote: 'Automation Affairs transformed our entire workflow. What used to take our team hours now happens automatically. The ROI was clear within the first month.',
            name: 'Sarah Chen',
            position: 'Head of Operations',
            company: 'TechFlow Solutions',
            location: 'Berlin, Germany'
          },
          {
            quote: 'Their approach is refreshingly practical. No buzzwords, just solid automation that actually works. Our customer response time improved by 60%.',
            name: 'Marcus Weber',
            position: 'CTO',
            company: 'DataSync GmbH',
            location: 'Munich, Germany'
          },
          {
            quote: 'Finally, an AI partner that understands privacy and compliance. They built us a GDPR-compliant automation system that our legal team actually approved.',
            name: 'Elena Rodriguez',
            position: 'VP of Digital Transformation',
            company: 'EuroFinance AG',
            location: 'Frankfurt, Germany'
          },
          {
            quote: 'The team at Automation Affairs doesn\'t just build tools—they solve problems. Our manual processes are now fully automated, and our team loves the new efficiency.',
            name: 'James Mitchell',
            position: 'Operations Director',
            company: 'LogiCore International',
            location: 'Amsterdam, Netherlands'
          }
        ]
      },
      cta: {
        title: 'Let\'s future-proof your business',
        subtitle: 'and build Clear, secure automation — with us as your partner.',
        button: 'Start the conversation',
      },
      kpis: {
        hoursSaved: '10,000+',
        hoursSavedLabel: 'Hours Saved',
        fasterSla: '65%',
        fasterSlaLabel: 'Faster SLA',
        costReduction: '40%',
        costReductionLabel: 'Cost Reduction',
        satisfaction: '98%',
        satisfactionLabel: 'Client Satisfaction',
      },
      values: {
        title: 'Our Values',
        subtitle: 'The principles that guide everything we build',
        items: {
          humanLed: {
            title: 'Human-Led Automation',
            description: 'AI augments our capabilities, it doesn\'t replace them. We build guardrails, keep humans in the loop, and design for trust.',
          },
          outcomes: {
            title: 'Outcomes over hype',
            description: 'We measure success in time saved, costs reduced, and risk minimized - not buzzwords. Every engagement ties back to a concrete business outcome.',
          },
          partner: {
            title: 'Partner, not Vendor',
            description: 'We map workflows together, align on decisions, and own outcomes. Your team stays in control; we amplify their capabilities.',
          },
          privacy: {
            title: 'Privacy conscious',
            description: 'We default to GDPR compliant, responsible data handling and can go self-hosted where needed - balancing compliance with practicality.',
          },
          precision: {
            title: 'Precision & Clarity',
            description: 'We design systems that work: simple, robust, and scalable. With clear scoping and accessible documentation, we cut through the noise.',
          },
        },
      },
    },
    about: {
      title: 'About Us',
      intro: {
        paragraphs: [
          'We bridge business and technology - turning needs into systems, making clear decisions, and shipping what truly moves the needle.',
          'We put people first - through design, communication, and care for your data and privacy. That\'s why we\'re the partner for your journey.',
          'We\'re creators at heart: practical, direct, and hands-on. At Automation Affairs, we draw from a broad skill set to design, build, and solve with clarity - always delivering what matters.'
        ]
      },
      mission: {
        title: 'Our Mission',
        description: 'As your transformation partner, we simplify AI adoption and drive intelligent automations across your business. We optimize critical workflows, apply AI where it creates real value, and deliver end-to-end automations that reduce costs and free up your teams\' time.',
      },
      vision: {
        title: 'Our Vision',
        description: 'For businesses across Europe, thriving means embracing reliable AI and automations they can trust. Automation Affairs ensures adoption is clear, secure, and effective - keeping companies ahead in a data-driven world.',
      },
      values: {
        title: 'Our Values',
        items: {
          excellence: {
            title: 'Technical Excellence',
            description: 'We deliver robust, scalable solutions built with industry best practices and rigorous testing.',
          },
          innovation: {
            title: 'Pragmatic Innovation',
            description: 'We embrace cutting-edge technologies while prioritizing proven, reliable approaches that deliver real ROI.',
          },
          partnership: {
            title: 'True Partnership',
            description: 'We work as an extension of your team, understanding your business deeply to create lasting transformation.',
          },
        },
      },
      whoWeAre: {
        title: 'Who We Are',
        description: 'We are a specialized team of automation engineers, AI developers, and business strategists with deep expertise in enterprise transformation. Our backgrounds span Fortune 500 consulting, startup innovation, and technical leadership across industries from finance to manufacturing.',
      },
      approach: {
        title: 'Our Approach',
        description: 'Every engagement follows our proven methodology built on three core principles:',
        principles: [
          'Systems thinking: We map your entire ecosystem to design holistic solutions that work seamlessly together',
          'GDPR by design: Privacy and compliance are architected into every solution from day one',
          'Production-ready builds: We prioritize reliability, maintainability, and performance over flashy features'
        ],
      },
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'Ready to explore a use case? Tell us where you\'re at.',
      hero: {
        title: 'Get in Touch',
        subtitle: 'Ready to explore a use case? Tell us where you\'re at.',
      },
      info: {
        title: 'Contact Information',
        email: {
          title: 'Email',
        },
        phone: {
          title: 'Phone',
        },
        location: {
          title: 'Location',
          address: 'Berlin, Germany',
        },
      },
      form: {
        name: 'Name',
        email: 'Email',
        company: 'Company',
        role: 'Role',
        website: 'Website',
        companySize: 'Company Size',
        budget: 'Budget Range',
        interests: 'Areas of Interest',
        message: 'Message',
        consent: 'I agree to the processing of my personal data according to the Privacy Policy',
        submit: 'Send Message',
        submitting: 'Sending...',
        required: 'This field is required',
        namePlaceholder: 'Your full name',
        emailPlaceholder: 'your.email@company.com',
        companyPlaceholder: 'Your company name',
        rolePlaceholder: 'Your role or title',
        websitePlaceholder: 'https://yourcompany.com',
        messagePlaceholder: 'Tell us about your automation needs...',
        companySizePlaceholder: 'Select company size',
        budgetPlaceholder: 'Select budget range',
        companySizeOptions: {
          small: '1-10 employees',
          medium: '11-50 employees',
          large: '51-200 employees',
          enterprise: '201-1000 employees',
          corporation: '1000+ employees',
        },
        budgetOptions: {
          small: 'Under €10,000',
          medium: '€10,000 - €50,000',
          large: '€50,000 - €100,000',
          enterprise: '€100,000+',
        },
        interestOptions: {
          aiAgents: 'AI Agents',
          rag: 'RAG Systems',
          workflowAutomation: 'Workflow Automation',
          apiIntegrations: 'API Integrations',
          selfHostedAI: 'Self-Hosted AI',
        },
      },
      success: {
        title: 'Thank You!',
        message: 'Your message has been sent successfully. We\'ll get back to you within 24 hours.',
      },
    },
    legal: {
      impressum: {
        title: 'Legal Notice - Imprint',
        brandDescription: 'Automation Affairs is a brand operated by two independent sole proprietors.',
        address: 'Address',
        court: 'Court of jurisdiction',
        vatId: 'VAT ID',
        phone: 'Phone',
        email: 'Email',
        registeredTrade: 'Registered Trade',
        disclaimer: 'Legal Disclaimer',
        disclaimerText: 'Both proprietors operate independently under their own legal responsibility. The shared brand identity "Automation Affairs" represents a collaborative business relationship but does not constitute a legal partnership or joint liability.',
        darioTrade: 'IT Consulting and Data Processing Services',
        maxTrade: 'Services in automatic data processing and information technology'
      },
      privacy: {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated',
        overview: {
          title: 'Data Protection Overview',
          content: 'The following gives a simple overview of what happens to your personal information when you visit our website. Personal information is any data with which you could be personally identified. Detailed information on the subject of data protection can be found in our privacy policy found below.'
        },
        controllers: {
          title: 'Data Controllers',
          content: 'This website is jointly operated by two independent data controllers:'
        },
        collection: {
          title: 'Data Collection on Our Website',
          whoCollects: {
            title: 'Who is responsible for the data collection on this website?',
            content: 'The data collected on this website are processed by the website operators. Their contact details can be found in the website\'s required legal notice.'
          },
          howCollect: {
            title: 'How do we collect your data?',
            content: 'Some data are collected when you provide it to us. This could, for example, be data you enter on a contact form. Other data are collected automatically by our IT systems when you visit the website. These data are primarily technical data such as the browser and operating system you are using or when you accessed the page.'
          },
          whatFor: {
            title: 'What do we use your data for?',
            content: 'Part of the data is collected to ensure the proper functioning of the website. Other data can be used to analyze how visitors use the site.'
          }
        },
        rights: {
          title: 'Your Rights',
          content: 'You have the right to receive information about the origin, recipient, and purpose of your stored personal data at any time without charge. You also have the right to request that it be corrected, blocked, or deleted. You can contact us at any time using the address given in the legal notice if you have further questions about the issue of privacy and data protection.'
        },
        cookies: {
          title: 'Cookies and Tracking',
          content: 'This website uses cookies and similar tracking technologies to enhance user experience and analyze website usage. You can manage your cookie preferences through your browser settings.'
        },
        contact: {
          title: 'Contact Information',
          content: 'If you have questions about data protection, please contact us using the contact information provided in our legal notice.',
          authority: 'You also have the right to file a complaint with the competent supervisory authority.'
        }
      },
    },
  },
  de: {
    common: {
      nav: {
        home: 'Startseite',
        about: 'Über uns',
        contact: 'Kontakt',
        getInTouch: 'Kontakt aufnehmen',
      },
      a11y: {
        skipToContent: 'Zum Hauptinhalt springen',
        toggleTheme: 'Design wechseln',
        toggleLanguage: 'Sprache wechseln',
        openMenu: 'Menü öffnen',
        closeMenu: 'Menü schließen',
      },
      footer: {
        email: 'hello@automationaffairs.com',
        social: {
          linkedin: 'LinkedIn',
          youtube: 'YouTube',
        },
        legal: {
          impressum: 'Impressum',
          privacy: 'Datenschutz',
          cookies: 'Cookie-Einstellungen',
        },
      },
      cookies: {
        title: 'Wir verwenden Cookies',
        description: 'Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern, personalisierte Inhalte bereitzustellen und unseren Traffic zu analysieren. Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung von Cookies zu.',
        customize: 'Anpassen',
        necessary: 'Nur notwendige',
        acceptAll: 'Alle akzeptieren',
        preferences: 'Cookie-Einstellungen',
        required: 'Erforderlich',
        savePreferences: 'Einstellungen speichern',
        categories: {
          necessary: {
            title: 'Notwendige Cookies',
            description: 'Diese Cookies sind für das ordnungsgemäße Funktionieren der Website unerlässlich. Sie ermöglichen grundlegende Funktionen wie Seitennavigation und Zugang zu sicheren Bereichen.',
          },
          analytics: {
            title: 'Analyse-Cookies',
            description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen anonym sammeln und melden.',
          },
          marketing: {
            title: 'Marketing-Cookies',
            description: 'Diese Cookies werden verwendet, um Besucher über Websites hinweg zu verfolgen, um relevante Werbung anzuzeigen und die Kampagneneffektivität zu messen.',
          },
          functional: {
            title: 'Funktionale Cookies',
            description: 'Diese Cookies ermöglichen erweiterte Funktionalität und Personalisierung, wie das Merken Ihrer Präferenzen und Einstellungen.',
          },
        },
      },
      seo: {
        siteName: 'Automation Affairs',
        defaultTitle: 'Automation Affairs - Ihr Transformationspartner für KI & Automatisierung',
        defaultDescription: 'Wir helfen Unternehmen bei der Transformation durch intelligente Automatisierung und KI-Integration. Spezialisiert auf KI-Agenten, RAG-Systeme, Workflow-Automatisierung, API-Integrationen und Self-Hosted KI-Lösungen.',
        defaultKeywords: 'Automatisierung, KI, künstliche Intelligenz, Workflow-Automatisierung, API-Integration, RAG-Systeme, KI-Agenten, Unternehmenstransformation, DSGVO-konforme KI',
        home: {
          title: 'Ihr Transformationspartner für KI & Automatisierung',
          description: 'Transformieren Sie Ihr Unternehmen mit intelligenter Automatisierung und KI-Integration. Wir entwickeln KI-Agenten, RAG-Systeme, Workflow-Automatisierung und API-Integrationen mit echtem ROI.',
          keywords: 'KI-Automatisierung, Unternehmenstransformation, KI-Agenten, RAG-Systeme, Workflow-Automatisierung, API-Integration, Self-Hosted KI'
        },
        about: {
          title: 'Über uns - Experten-Team für KI & Automatisierung',
          description: 'Lernen Sie unser spezialisiertes Team aus Automatisierungsingenieuren, KI-Entwicklern und Geschäftsstrategen kennen. Erfahren Sie mehr über unsere Mission, Vision und Ansatz zur Unternehmenstransformation.',
          keywords: 'Automatisierungs-Team, KI-Experten, Geschäftsstrategen, Unternehmenstransformation, technische Exzellenz'
        },
        contact: {
          title: 'Kontakt - Starten Sie Ihre Automatisierungsreise',
          description: 'Bereit, Ihr Unternehmen mit KI und Automatisierung zu transformieren? Kontaktieren Sie unsere Experten, um Ihre Automatisierungsanforderungen zu besprechen und Möglichkeiten zu erkunden.',
          keywords: 'Automatisierungs-Experten kontaktieren, KI-Beratung, Automatisierungs-Beratung, Unternehmenstransformation Anfrage'
        }
      },
    },
    home: {
      hero: {
        title: 'AUTOMATION\nAFFAIRS',
        subtitle: 'Durchbrechen Sie das Rauschen. Bauen Sie, was zählt.',
        primaryCta: 'Kontakt aufnehmen',
        secondaryCta: 'Unsere Arbeitsweise',
      },
      whatWeDo: {
        title: 'KI als Werkzeug, nicht als Glücksspiel.',
        description: 'Wir durchbrechen das KI-Rauschen und konzentrieren uns auf das Wesentliche: Effizientere Arbeitsabläufe. Wir kartieren kritische Prozesse, verbinden die richtigen Tools und liefern Automatisierungen und Agenten, die Ihr Team verstärken. Saubere Builds, klare Dokumentation und datenschutzbewusste Lieferung—zuverlässige Systeme, keine Experimente.',
      },
      process: {
        title: 'Wie wir arbeiten',
        subtitle: 'Drei fokussierte Schritte zur Transformation Ihrer Abläufe',
        steps: {
          scope: {
            title: 'Umfang',
            description: 'Ziele definieren und Arbeitsabläufe kartieren.',
            icon: '🎯'
          },
          identify: {
            title: 'Identifizieren',
            description: 'Ineffizienzen erkennen und Prioritäten setzen.',
            icon: '🔍'
          },
          build: {
            title: 'Bauen',
            description: 'Automatisierung entwerfen, verbinden und liefern.',
            icon: '🔧'
          },
        },
      },
      testimonials: {
        title: 'Was unsere Kunden sagen',
        subtitle: 'Echte Ergebnisse aus echten Partnerschaften',
        items: [
          {
            quote: 'Automation Affairs hat unseren gesamten Workflow transformiert. Was unser Team früher stundenlang gemacht hat, passiert jetzt automatisch. Der ROI war bereits im ersten Monat klar.',
            name: 'Sarah Chen',
            position: 'Leiterin Operations',
            company: 'TechFlow Solutions',
            location: 'Berlin, Deutschland'
          },
          {
            quote: 'Ihr Ansatz ist erfrischend praktisch. Keine Buzzwords, nur solide Automatisierung, die tatsächlich funktioniert. Unsere Kundenreaktionszeit verbesserte sich um 60%.',
            name: 'Marcus Weber',
            position: 'CTO',
            company: 'DataSync GmbH',
            location: 'München, Deutschland'
          },
          {
            quote: 'Endlich ein KI-Partner, der Datenschutz und Compliance versteht. Sie bauten uns ein DSGVO-konformes Automatisierungssystem, das sogar unser Rechtsteam genehmigte.',
            name: 'Elena Rodriguez',
            position: 'VP Digital Transformation',
            company: 'EuroFinance AG',
            location: 'Frankfurt, Deutschland'
          },
          {
            quote: 'Das Team von Automation Affairs baut nicht nur Tools—sie lösen Probleme. Unsere manuellen Prozesse sind jetzt vollständig automatisiert, und unser Team liebt die neue Effizienz.',
            name: 'James Mitchell',
            position: 'Operations Director',
            company: 'LogiCore International',
            location: 'Amsterdam, Niederlande'
          }
        ]
      },
      cta: {
        title: 'Lassen Sie uns Ihr Unternehmen zukunftssicher machen',
        subtitle: 'und klare, sichere Automatisierung aufbauen — mit uns als Ihrem Partner.',
        button: 'Das Gespräch beginnen',
      },
      kpis: {
        hoursSaved: '10.000+',
        hoursSavedLabel: 'Gesparte Stunden',
        fasterSla: '65%',
        fasterSlaLabel: 'Schnellere SLA',
        costReduction: '40%',
        costReductionLabel: 'Kostensenkung',
        satisfaction: '98%',
        satisfactionLabel: 'Kundenzufriedenheit',
      },
      values: {
        title: 'Unsere Werte',
        subtitle: 'Die Prinzipien, die alles leiten, was wir entwickeln',
        items: {
          humanLed: {
            title: 'Menschengeführte Automatisierung',
            description: 'KI erweitert unsere Fähigkeiten, ersetzt sie aber nicht. Wir bauen Leitplanken, halten Menschen im Prozess und entwerfen für Vertrauen.',
          },
          outcomes: {
            title: 'Ergebnisse statt Hype',
            description: 'Wir messen Erfolg an gesparter Zeit, reduzierten Kosten und minimiertem Risiko - nicht an Schlagworten. Jedes Engagement führt zu einem konkreten Geschäftsergebnis.',
          },
          partner: {
            title: 'Partner, nicht Lieferant',
            description: 'Wir kartieren Arbeitsabläufe gemeinsam, stimmen Entscheidungen ab und übernehmen Verantwortung für Ergebnisse. Ihr Team behält die Kontrolle; wir verstärken ihre Fähigkeiten.',
          },
          privacy: {
            title: 'Datenschutzbewusst',
            description: 'Wir setzen standardmäßig auf DSGVO-konforme, verantwortungsvolle Datenverarbeitung und können bei Bedarf selbst hosten - Compliance mit Praktikabilität balancierend.',
          },
          precision: {
            title: 'Präzision & Klarheit',
            description: 'Wir entwerfen Systeme, die funktionieren: einfach, robust und skalierbar. Mit klarer Abgrenzung und zugänglicher Dokumentation durchbrechen wir das Rauschen.',
          },
        },
      },
    },
    about: {
      title: 'Über uns',
      intro: {
        paragraphs: [
          'Wir verbinden Geschäft und Technologie - verwandeln Bedürfnisse in Systeme, treffen klare Entscheidungen und liefern das, was wirklich den Unterschied macht.',
          'Wir stellen Menschen in den Mittelpunkt - durch Design, Kommunikation und Sorgfalt für Ihre Daten und Privatsphäre. Deshalb sind wir der Partner für Ihre Reise.',
          'Wir sind Schöpfer im Herzen: praktisch, direkt und hands-on. Bei Automation Affairs schöpfen wir aus einem breiten Spektrum an Fähigkeiten, um mit Klarheit zu entwerfen, zu bauen und zu lösen - immer das liefernd, was zählt.'
        ]
      },
      mission: {
        title: 'Unsere Mission',
        description: 'Als Ihr Transformationspartner vereinfachen wir die KI-Einführung und treiben intelligente Automatisierungen in Ihrem Unternehmen voran. Wir optimieren kritische Arbeitsabläufe, setzen KI dort ein, wo sie echten Wert schafft, und liefern End-to-End-Automatisierungen, die Kosten reduzieren und Ihren Teams Zeit für das Wesentliche verschaffen.',
      },
      vision: {
        title: 'Unsere Vision',
        description: 'Für Unternehmen in ganz Europa bedeutet Erfolg, zuverlässige KI und Automatisierungen zu nutzen, denen sie vertrauen können. Automation Affairs sorgt dafür, dass die Einführung klar, sicher und effektiv ist - damit Unternehmen in einer datengetriebenen Welt die Nase vorn behalten.',
      },
      values: {
        title: 'Unsere Werte',
        items: {
          excellence: {
            title: 'Technische Exzellenz',
            description: 'Wir liefern robuste, skalierbare Lösungen, die mit Industriestandards und rigorosen Tests entwickelt werden.',
          },
          innovation: {
            title: 'Pragmatische Innovation',
            description: 'Wir nutzen modernste Technologien und priorisieren dabei bewährte, zuverlässige Ansätze mit echtem ROI.',
          },
          partnership: {
            title: 'Echte Partnerschaft',
            description: 'Wir arbeiten als Erweiterung Ihres Teams und verstehen Ihr Unternehmen tiefgreifend für nachhaltige Transformation.',
          },
        },
      },
      whoWeAre: {
        title: 'Wer wir sind',
        description: 'Wir sind ein spezialisiertes Team aus Automatisierungsingenieuren, KI-Entwicklern und Geschäftsstrategen mit tiefgreifender Expertise in Unternehmenstransformation. Unsere Hintergründe umfassen Fortune-500-Beratung, Startup-Innovation und technische Führung in Branchen von Finanzen bis Fertigung.',
      },
      approach: {
        title: 'Unser Ansatz',
        description: 'Jedes Engagement folgt unserer bewährten Methodik, die auf drei Kernprinzipien basiert:',
        principles: [
          'Systemdenken: Wir kartieren Ihr gesamtes Ökosystem, um ganzheitliche Lösungen zu entwerfen, die nahtlos zusammenarbeiten',
          'DSGVO by Design: Datenschutz und Compliance sind von Tag eins in jede Lösung eingebaut',
          'Produktionsreife Builds: Wir priorisieren Zuverlässigkeit, Wartbarkeit und Performance über auffällige Features'
        ],
      },
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Bereit, einen Anwendungsfall zu erkunden? Erzählen Sie uns, wo Sie stehen.',
      hero: {
        title: 'Kontakt aufnehmen',
        subtitle: 'Bereit, einen Anwendungsfall zu erkunden? Erzählen Sie uns, wo Sie stehen.',
      },
      info: {
        title: 'Kontakt',
        email: {
          title: 'E-Mail',
        },
        phone: {
          title: 'Telefon',
        },
        location: {
          title: 'Standort',
          address: 'Berlin, Deutschland',
        },
      },
      form: {
        name: 'Name',
        email: 'E-Mail',
        company: 'Unternehmen',
        role: 'Position',
        website: 'Website',
        companySize: 'Unternehmensgröße',
        budget: 'Budget-Bereich',
        interests: 'Interessensbereiche',
        message: 'Nachricht',
        consent: 'Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der Datenschutzerklärung zu',
        submit: 'Nachricht senden',
        submitting: 'Wird gesendet...',
        required: 'Dieses Feld ist erforderlich',
        namePlaceholder: 'Ihr vollständiger Name',
        emailPlaceholder: 'ihre.email@unternehmen.de',
        companyPlaceholder: 'Ihr Unternehmensname',
        rolePlaceholder: 'Ihre Position oder Titel',
        websitePlaceholder: 'https://ihrunternehmen.de',
        messagePlaceholder: 'Erzählen Sie uns von Ihren Automatisierungsanforderungen...',
        companySizePlaceholder: 'Unternehmensgröße auswählen',
        budgetPlaceholder: 'Budget-Bereich auswählen',
        companySizeOptions: {
          small: '1-10 Mitarbeiter',
          medium: '11-50 Mitarbeiter',
          large: '51-200 Mitarbeiter',
          enterprise: '201-1000 Mitarbeiter',
          corporation: '1000+ Mitarbeiter',
        },
        budgetOptions: {
          small: 'Unter €10.000',
          medium: '€10.000 - €50.000',
          large: '€50.000 - €100.000',
          enterprise: '€100.000+',
        },
        interestOptions: {
          aiAgents: 'KI-Agenten',
          rag: 'RAG-Systeme',
          workflowAutomation: 'Workflow-Automatisierung',
          apiIntegrations: 'API-Integrationen',
          selfHostedAI: 'Self-Hosted KI',
        },
      },
      success: {
        title: 'Vielen Dank!',
        message: 'Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
      },
    },
    legal: {
      impressum: {
        title: 'Impressum',
        brandDescription: 'Automation Affairs ist eine Marke, die von zwei unabhängigen Einzelunternehmern betrieben wird.',
        address: 'Adresse',
        court: 'Zuständiges Gericht',
        vatId: 'Umsatzsteuer-ID',
        phone: 'Telefon',
        email: 'E-Mail',
        registeredTrade: 'Eingetragenes Gewerbe',
        disclaimer: 'Rechtlicher Hinweis',
        disclaimerText: 'Beide Unternehmer agieren unabhängig unter ihrer eigenen rechtlichen Verantwortung. Die gemeinsame Markenidentität "Automation Affairs" stellt eine kollaborative Geschäftsbeziehung dar, begründet aber keine rechtliche Partnerschaft oder gemeinsame Haftung.',
        darioTrade: 'IT-Beratung und Datenverarbeitungsdienstleistungen',
        maxTrade: 'Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik'
      },
      privacy: {
        title: 'Datenschutzerklärung',
        lastUpdated: 'Zuletzt aktualisiert',
        overview: {
          title: 'Datenschutz auf einen Blick',
          content: 'Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.'
        },
        controllers: {
          title: 'Verantwortliche Stellen',
          content: 'Diese Website wird gemeinsam von zwei unabhängigen Verantwortlichen betrieben:'
        },
        collection: {
          title: 'Datenerfassung auf unserer Website',
          whoCollects: {
            title: 'Wer ist verantwortlich für die Datenerfassung auf dieser Website?',
            content: 'Die Datenverarbeitung auf dieser Website erfolgt durch die Websitebetreiber. Deren Kontaktdaten können Sie dem Impressum dieser Website entnehmen.'
          },
          howCollect: {
            title: 'Wie erfassen wir Ihre Daten?',
            content: 'Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).'
          },
          whatFor: {
            title: 'Wofür nutzen wir Ihre Daten?',
            content: 'Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.'
          }
        },
        rights: {
          title: 'Ihre Rechte',
          content: 'Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.'
        },
        cookies: {
          title: 'Cookies und Tracking',
          content: 'Diese Website verwendet Cookies und ähnliche Tracking-Technologien, um die Benutzererfahrung zu verbessern und die Website-Nutzung zu analysieren. Sie können Ihre Cookie-Präferenzen über Ihre Browser-Einstellungen verwalten.'
        },
        contact: {
          title: 'Kontaktinformationen',
          content: 'Bei Fragen zum Datenschutz wenden Sie sich bitte an uns unter den im Impressum angegebenen Kontaktdaten.',
          authority: 'Sie haben außerdem das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren.'
        }
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    ns: ['common', 'home', 'about', 'contact', 'legal'],
    defaultNS: 'common',
    
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
