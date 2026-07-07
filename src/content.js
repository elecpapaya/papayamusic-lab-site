export const languages = [
  { code: 'en', label: 'EN', name: 'English', htmlLang: 'en' },
  { code: 'ko', label: 'KO', name: '한국어', htmlLang: 'ko' },
  { code: 'ja', label: 'JA', name: '日本語', htmlLang: 'ja' },
];

const fallbackLanguage = 'en';

export function getCurrentLanguage() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('lang');
  if (isSupportedLanguage(requested)) {
    window.localStorage?.setItem('papaya-site-language', requested);
    return requested;
  }

  const saved = window.localStorage?.getItem('papaya-site-language');
  if (isSupportedLanguage(saved)) {
    return saved;
  }

  const browserLanguage = window.navigator.language?.slice(0, 2);
  if (isSupportedLanguage(browserLanguage)) {
    return browserLanguage;
  }

  return fallbackLanguage;
}

export function getLanguageMeta(language) {
  return languages.find((item) => item.code === language) ?? languages[0];
}

export function setDocumentLanguage(language) {
  const meta = getLanguageMeta(language);
  document.documentElement.lang = meta.htmlLang;
  window.localStorage?.setItem('papaya-site-language', language);
}

export function localizedUrl(path, language, hash = '') {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}lang=${language}${hash}`;
}

export function updateTitle(title) {
  document.title = title ? `${title} | PapayaMusic Lab` : 'PapayaMusic Lab';
}

function isSupportedLanguage(language) {
  return languages.some((item) => item.code === language);
}

export const homeContent = {
  en: {
    nav: {
      pilot: 'Founder Pilot',
      blog: 'Blog',
      docs: 'Docs',
    },
    brandSubtitle: 'Studio Suite',
    hero: {
      eyebrow: 'For AI music studios and serious solo operators',
      title: 'Turn generated songs into finished releases.',
      lead:
        'A local production suite for AI music studios and solo catalog operators who need fewer loose candidates and more finished releases.',
      primaryCta: 'Talk about the pilot',
      secondaryCta: 'Read production notes',
      workflowLabel: 'Production state',
      consoleTitle: 'Release-ready record',
      consoleSubtitle: 'Local production record',
      consoleStatus: 'Ready for review',
      signalLabel: 'Production signal',
      signalValue: 'Evidence intact',
      renderLabel: 'Next step',
      renderValue: 'Finish package',
      publishLabel: 'Delivery',
      publishValue: 'Ready materials',
      batchLabel: 'Current work',
      batchValue: 'Pilot Project 01',
      timelineLabel: 'Release timeline',
      proof: ['Local-first install', 'Human approval stays clear', 'Release-ready records'],
      tracks: [
        ['Candidates sorted', 'Done'],
        ['Review notes', 'Ready'],
        ['Media package', 'Prepared'],
        ['Publish materials', 'Checked'],
      ],
    },
    target: {
      title: 'Best for',
      items: ['AI music production studios', 'Solo operators building a catalog', 'Teams stuck after generation'],
    },
    toolchain: {
      eyebrow: 'Existing toolchain',
      title: 'Works alongside the AI music tools you already use.',
      text:
        'PapayaMusic Lab does not replace your creative tools. It helps organize the production work around your existing accounts and desktop software.',
      tools: ['Suno', 'Google Flow', 'ChatGPT', 'REAPER', 'REAPER stock FX', 'DistroKid', 'YouTube'],
      note: 'Bring your own accounts and licenses. Tool names are shown only to explain the production context; no official partnership is implied unless stated.',
    },
    flow: [
      {
        title: 'Choose',
        text: 'Turn generated candidates into a clear release candidate.',
      },
      {
        title: 'Finish',
        text: 'Prepare the materials and notes needed to complete the release.',
      },
      {
        title: 'Prepare',
        text: 'Keep the final materials ready for human approval and publication.',
      },
    ],
    positioning: {
      eyebrow: 'Designed like a production system',
      title: 'Not another generator. The operating layer after generation.',
      cards: [
        {
          title: 'Reduce unfinished work',
          text:
            'Generated songs are easier to finish when selection, notes, media, and publishing readiness are handled in one production habit.',
        },
        {
          title: 'Keep decisions visible',
          text:
            'Important choices and review notes stay easy to find, so the next session starts from context instead of memory.',
        },
        {
          title: 'Work with local media',
          text:
            'Large audio and video files stay in a local-first workflow, with outside tools used only where the production needs them.',
        },
        {
          title: 'Keep approval human',
          text:
            'The system helps prepare release materials; final creative and publishing decisions remain explicit.',
        },
      ],
    },
    outcome: {
      eyebrow: 'Operator outcome',
      title: 'The value is not generation. It is finishing.',
      before: {
        label: 'Before',
        title: 'Generated candidates pile up',
        facts: ['37 song candidates', 'scattered notes', 'manual video files', 'publishing notes in chat'],
      },
      after: {
        label: 'After',
        title: 'A release is ready to move forward',
        facts: ['selected track set', 'review notes ready', 'media materials prepared', 'publishing copy checked'],
      },
    },
    caseStudy: {
      eyebrow: 'Example run',
      title: 'What changes in daily operation.',
      cards: [
        {
          title: 'Less repeated sorting',
          metric: 'One list',
          text: 'The same candidates do not need to be rediscovered across chats, folders, and notes.',
        },
        {
          title: 'Clearer next action',
          metric: 'One state',
          text: 'A paused project can be resumed without rebuilding the whole context from scratch.',
        },
        {
          title: 'Safer delivery',
          metric: 'One package',
          text: 'The materials needed for release review and publishing preparation stay together.',
        },
      ],
    },
    pilot: {
      eyebrow: 'Founder Pilot',
      title: 'Apply if this is already your bottleneck.',
      checklistTitle: 'Good fit signals',
      checklist: [
        'You are a solo operator or small studio treating AI music as recurring production work.',
        'You manage 30+ generated track candidates per month.',
        'Selection, metadata, video, publishing, and release review are tracked manually.',
        'Songs are generated faster than they become finished releases.',
      ],
      offer: {
        label: 'Pilot offer',
        title: 'USD 199',
        terms: [
          { label: 'Term', value: 'First 30 days' },
          { label: 'After', value: 'USD 69 / 30 days' },
          { label: 'Renewal', value: 'Manual only' },
        ],
        itemsTitle: 'Included',
        items: ['Fit and support-scope call', 'Protected Windows download and license after payment', 'Guided setup', 'One production review'],
        note: 'Payment happens after the fit check. Support scope and refund terms are confirmed before payment.',
      },
      cards: [
        {
          title: 'Who it is for',
          text:
            'Small AI music studios and serious solo creators who already generate enough songs that selection, metadata, mastering notes, media materials, and publishing are becoming the bottleneck.',
        },
        {
          title: 'What the pilot includes',
          text:
            'Protected private download access, license activation, guided setup, early builds, one real production review, and direct feedback on setup blockers.',
        },
        {
          title: 'Support boundary',
          text:
            'Support covers install, setup, and PapayaMusic Lab setup blockers. Third-party account issues, legal advice, guaranteed AI output quality, and unlimited production labor stay outside the pilot scope.',
        },
      ],
      requestCta: 'Talk about the pilot',
      paymentCta: 'Payment after fit check',
    },
    blog: {
      eyebrow: 'Production Log',
      title: 'Notes from release, video, and publishing runs.',
      readCta: 'Read note',
      allCta: 'Open blog',
      featuredLabel: 'Featured note',
      archiveTitle: 'All notes',
      postCountLabel: 'Post count',
      managerTitle: 'Production note guide',
      managerText: 'Production notes about decisions, tradeoffs, and local-first operating choices.',
      introText:
        'Short operating notes about where AI music production gets stuck and how to think about finishing work.',
      sourceLabel: 'Scope',
      sourceValue: 'Production notes and operating lessons',
      rssCta: 'RSS feed',
      backCta: 'Back to blog',
    },
    docs: {
      eyebrow: 'Docs',
      title: 'What to know before starting Founder Pilot.',
      introText:
        'A buyer-facing guide to fit, local data, install, pricing, support, and what happens after you get in touch.',
      managerTitle: 'Pilot guide overview',
      sourceLabel: 'Covers',
      sourceValue: 'Pilot fit, local data, access, support',
      depthLabel: 'Purpose',
      depthValue: 'Help you decide whether to apply',
      readingTitle: 'Questions this page answers',
      readCta: 'Full setup details are shared after payment',
      links: ['Fit', 'Local data', 'Install and license', 'Pricing and support'],
      readingOrder: [
        {
          label: '01',
          title: 'Is this for my kind of work?',
          text: 'Who the Founder Pilot is for, and which AI music operations are likely to benefit from a local desktop workflow.',
        },
        {
          label: '02',
          title: 'What stays on my machine?',
          text: 'Which unreleased media, project files, local paths, and account details remain local by default.',
        },
        {
          label: '03',
          title: 'How do install and updates work?',
          text: 'What to expect from the protected Windows download, license activation, setup support, and update notices.',
        },
        {
          label: '04',
          title: 'What do I pay for?',
          text: 'Founder Pilot Studio is USD 199 for the first 30 days. Continued access is optional at USD 69 per 30 days, with no automatic renewal during the pilot.',
        },
      ],
      operatingTitle: 'Pilot operating flow',
      operatingIntro:
        'Use this page to understand the product fit, local-first boundary, access flow, and support scope before applying.',
      trustTitle: 'What you can evaluate before applying',
      trustIntro:
        'These points are intended to make the pilot decision clear before any paid access is granted.',
      trustCards: [
        {
          title: 'What it helps with',
          text: 'The pilot focuses on the work after generation: choosing what to finish, keeping review context, preparing release materials, and reducing repeated manual tracking.',
        },
        {
          title: 'What stays local',
          text: 'Unreleased audio, lyrics, video clips, project files, local paths, browser sessions, and third-party credentials stay on your machine unless you explicitly export diagnostics for support.',
        },
        {
          title: 'External tools',
          text: 'Works alongside your own Suno, Google Flow, ChatGPT, REAPER, DistroKid, and YouTube accounts. Compatibility is described; official partnership is not implied.',
        },
        {
          title: 'Pilot support scope',
          text: 'Support covers install, setup, and PapayaMusic Lab blockers. It excludes unlimited production labor, legal advice, external account management, and guaranteed AI output quality.',
        },
        {
          title: 'Price and access',
          text: 'Founder Pilot Studio is USD 199 for the first 30 days. After that, continued access and private updates can be extended manually at USD 69 per 30 days.',
        },
      ],
      operatingSteps: [
        {
          label: 'Step 1',
          title: 'Send a short note',
          text: 'Share what you are trying to finish, your current bottleneck, and the tools you already use.',
          items: ['Use the pilot form', 'Keep private credentials out of the message', 'Include only the context needed for a useful reply'],
        },
        {
          label: 'Step 2',
          title: 'Confirm fit, price, and scope',
          text: 'Before payment, you receive a clear reply about fit, price, included support, excluded support, and refund terms.',
          items: ['Ask questions before paying', 'Confirm the target Windows machine', 'Decide whether the pilot is worth starting'],
        },
        {
          label: 'Step 3',
          title: 'Install with guidance',
          text: 'After payment, you receive protected download access, license activation help, setup guidance, and one supported production review.',
          items: ['Install the protected Windows build', 'Activate the license', 'Share setup blockers with enough context for support'],
        },
      ],
    },
    footerEmailSubject: 'PapayaMusic Lab Founder Pilot',
  },
  ko: {
    nav: {
      pilot: '파운더 파일럿',
      blog: '블로그',
      docs: '문서',
    },
    brandSubtitle: '스튜디오 스위트',
    hero: {
      eyebrow: 'AI 음악 스튜디오와 진지한 1인 운영자를 위해',
      title: '생성된 곡을 릴리즈 가능한 작품으로 끝냅니다.',
      lead:
        '생성 후보는 줄이고, 완성된 릴리즈는 늘리고 싶은 AI 음악 스튜디오와 1인 카탈로그 운영자를 위한 로컬 제작 스위트입니다.',
      primaryCta: 'Founder Pilot 상담 신청',
      secondaryCta: '제작 기록 보기',
      workflowLabel: '제작 상태',
      consoleTitle: '릴리즈 준비 기록',
      consoleSubtitle: '로컬 제작 기록',
      consoleStatus: '검토 준비',
      signalLabel: 'Production signal',
      signalValue: 'Evidence intact',
      renderLabel: '다음 단계',
      renderValue: '패키지 완성',
      publishLabel: '전달 자료',
      publishValue: '준비됨',
      batchLabel: '현재 작업',
      batchValue: 'Pilot Project 01',
      timelineLabel: 'Release timeline',
      proof: ['로컬 설치', '사람 승인 유지', '릴리즈 준비 기록'],
      tracks: [
        ['후보 정리', '완료'],
        ['리뷰 노트', '준비됨'],
        ['미디어 자료', '준비됨'],
        ['공개 자료', '확인됨'],
      ],
    },
    target: {
      title: '잘 맞는 사용자',
      items: ['AI 음악 제작 스튜디오', '카탈로그를 쌓는 1인 운영자', '생성 이후 단계가 병목인 팀'],
    },
    toolchain: {
      eyebrow: '기존 제작 툴체인',
      title: '이미 쓰는 AI 음악 제작 도구와 함께 작동합니다.',
      text:
        'PapayaMusic Lab은 기존 창작 도구를 대체하지 않습니다. 사용자의 계정과 데스크톱 도구 주변에서 제작 운영을 정리합니다.',
      tools: ['Suno', 'Google Flow', 'ChatGPT', 'REAPER', 'REAPER stock FX', 'DistroKid', 'YouTube'],
      note: '사용자의 기존 계정과 라이선스를 전제로 합니다. 도구명은 제작 맥락을 설명하기 위한 것이며, 별도 표기가 없는 한 공식 제휴를 의미하지 않습니다.',
    },
    flow: [
      {
        title: '선택',
        text: '생성 후보를 명확한 릴리즈 후보로 좁힙니다.',
      },
      {
        title: '완성',
        text: '릴리즈를 끝내는 데 필요한 자료와 노트를 준비합니다.',
      },
      {
        title: '준비',
        text: '최종 자료를 사람의 승인과 공개 준비 상태로 둡니다.',
      },
    ],
    positioning: {
      eyebrow: '제작 시스템처럼 설계',
      title: '또 하나의 생성기가 아니라, 생성 이후의 운영 레이어.',
      cards: [
        {
          title: '끝나지 않은 작업을 줄임',
          text:
            '선별, 노트, 미디어, 공개 준비를 하나의 제작 습관으로 묶으면 생성곡이 릴리즈까지 가기 쉬워집니다.',
        },
        {
          title: '결정 맥락 유지',
          text:
            '중요한 판단과 리뷰 노트가 흩어지지 않아, 다음 작업 세션이 기억이 아니라 맥락에서 시작됩니다.',
        },
        {
          title: '로컬 미디어와 함께 작업',
          text:
            '큰 오디오와 영상 파일은 local-first로 두고, 외부 도구는 제작에 필요한 지점에서만 함께 사용합니다.',
        },
        {
          title: '최종 판단은 사람이 유지',
          text:
            '제품은 릴리즈 자료 준비를 돕고, 창작과 공개의 최종 결정은 명확하게 사람에게 남깁니다.',
        },
      ],
    },
    outcome: {
      eyebrow: 'Operator outcome',
      title: '가치는 생성이 아니라, 끝까지 완성하는 데 있습니다.',
      before: {
        label: 'Before',
        title: '생성 후보가 계속 쌓임',
        facts: ['37개 곡 후보', '흩어진 프롬프트', '수동 영상 파일 관리', '채팅 속 퍼블리싱 노트'],
      },
      after: {
        label: 'After',
        title: '다음 단계로 넘길 릴리즈가 준비됨',
        facts: ['선택된 트랙 세트', '리뷰 노트 준비', '미디어 자료 준비', '공개 문구 확인'],
      },
    },
    caseStudy: {
      eyebrow: 'Example run',
      title: '일상 운영에서 달라지는 것.',
      cards: [
        {
          title: '반복 선별 감소',
          metric: '하나의 목록',
          text: '같은 후보를 채팅, 폴더, 노트 사이에서 다시 찾는 시간을 줄입니다.',
        },
        {
          title: '다음 행동 명확화',
          metric: '하나의 상태',
          text: '멈춘 프로젝트를 다시 열 때 전체 맥락을 처음부터 만들지 않아도 됩니다.',
        },
        {
          title: '안전한 전달',
          metric: '하나의 패키지',
          text: '릴리즈 검토와 공개 준비에 필요한 자료가 함께 남습니다.',
        },
      ],
    },
    pilot: {
      eyebrow: 'Founder Pilot',
      title: '이미 이 문제가 병목이라면 신청하세요.',
      checklistTitle: '잘 맞는 신호',
      checklist: [
        'AI 음악을 반복적인 제작 업무로 다루는 1인 운영자 또는 소규모 스튜디오입니다.',
        '한 달에 생성 트랙 후보를 30개 이상 관리합니다.',
        '선별, 메타데이터, 영상, 퍼블리싱, 릴리즈 검토를 수동으로 추적합니다.',
        '곡은 생성되지만 완성된 릴리즈까지 끝나는 비율이 낮습니다.',
      ],
      offer: {
        label: 'Pilot offer',
        title: 'USD 199',
        terms: [
          { label: '기간', value: '첫 30일' },
          { label: '이후', value: 'USD 69 / 30일' },
          { label: '갱신', value: '수동 선택' },
        ],
        itemsTitle: '포함 내용',
        items: ['지원 범위 확인 상담', '결제 후 보호된 Windows 다운로드와 라이선스', '가이드 세팅', '제작 작업 1회 리뷰'],
        note: '결제는 상담 후 진행합니다. 지원 범위와 환불 조건은 결제 전에 확인합니다.',
      },
      cards: [
        {
          title: '누구를 위한가',
          text:
            '곡을 충분히 많이 생성해서 선별, 메타데이터, 마스터링 노트, 미디어 자료, 퍼블리싱이 병목이 된 AI 음악 제작 스튜디오와 진지한 1인 운영자를 위한 파일럿입니다.',
        },
        {
          title: '파일럿 포함 내용',
          text:
            '보호된 비공개 다운로드, 라이선스 활성화, 가이드 세팅, 초기 빌드, 실제 제작 작업 1회 리뷰, 세팅 중 막히는 지점에 대한 직접 피드백을 포함합니다.',
        },
        {
          title: '지원 범위',
          text:
            '지원은 설치, 세팅, PapayaMusic Lab 사용 중 막히는 지점에 집중합니다. 외부 계정 문제, 법률 자문, AI 결과물 품질 보장, 무제한 제작 대행은 파일럿 범위 밖입니다.',
        },
      ],
      requestCta: '파일럿 상담 신청',
      paymentCta: '상담 후 결제 안내',
    },
    blog: {
      eyebrow: '제작 로그',
      title: '릴리즈, 뮤직비디오, 퍼블리싱 과정에서 남긴 기록.',
      readCta: '글 읽기',
      allCta: '블로그 열기',
      featuredLabel: '대표 글',
      archiveTitle: '전체 글',
      postCountLabel: '글 수',
      managerTitle: '제작 노트 안내',
      managerText: '제작 판단, 운영상 tradeoff, local-first 선택을 다루는 노트입니다.',
      introText:
        'AI 음악 제작이 어디서 막히는지, 끝까지 완성하기 위해 어떤 판단이 필요한지 다루는 짧은 운영 노트입니다.',
      sourceLabel: '범위',
      sourceValue: '제작 노트와 운영 교훈',
      rssCta: 'RSS 피드',
      backCta: '블로그로 돌아가기',
    },
    docs: {
      eyebrow: '문서',
      title: 'Founder Pilot 시작 전에 확인할 내용.',
      introText:
        '제품 적합성, 로컬 데이터, 설치, 가격, 지원 범위, 상담 이후 흐름을 확인하기 위한 구매 전 안내입니다.',
      managerTitle: '파일럿 안내 개요',
      sourceLabel: '다루는 내용',
      sourceValue: '파일럿 적합성, 로컬 데이터, 접근, 지원',
      depthLabel: '목적',
      depthValue: '신청 여부를 판단하기 위한 안내',
      readingTitle: '이 페이지에서 확인할 수 있는 질문',
      readCta: '상세 세팅 안내는 결제 후 제공',
      links: ['적합성', '로컬 데이터', '설치와 라이선스', '가격과 지원'],
      readingOrder: [
        {
          label: '01',
          title: '내 작업에 맞는 제품인가',
          text: 'Founder Pilot이 누구에게 적합한지, 어떤 AI 음악 운영에서 local desktop 방식이 도움이 되는지 설명합니다.',
        },
        {
          label: '02',
          title: '무엇이 내 PC에 남는가',
          text: '미공개 미디어, 프로젝트 파일, 로컬 경로, 계정 관련 정보가 기본적으로 로컬에 남는 방식을 설명합니다.',
        },
        {
          label: '03',
          title: '설치와 업데이트는 어떻게 진행되는가',
          text: '보호된 Windows 다운로드, 라이선스 활성화, 세팅 지원, 업데이트 안내에서 기대할 수 있는 범위를 설명합니다.',
        },
        {
          label: '04',
          title: '무엇에 비용을 내는가',
          text: 'Founder Pilot Studio는 첫 30일 기준 USD 199입니다. 이후 계속 사용은 30일 단위 USD 69로 선택 연장하며, 파일럿 중 자동 결제는 없습니다.',
        },
      ],
      operatingTitle: '파일럿 운영 흐름',
      operatingIntro:
        '신청 전에 제품 적합성, local-first 경계, 접근 흐름, 지원 범위를 확인할 수 있습니다.',
      trustTitle: '신청 전에 판단할 수 있는 것',
      trustIntro:
        '아래 항목은 유료 접근 전에 파일럿이 현재 제작 운영에 맞는지 판단하기 위한 정보입니다.',
      trustCards: [
        {
          title: '무엇을 돕는가',
          text: '파일럿은 생성 이후 작업에 집중합니다. 무엇을 완성할지 고르고, 리뷰 맥락을 유지하고, 릴리즈 자료를 준비하며, 반복적인 수동 추적을 줄이는 데 초점을 둡니다.',
        },
        {
          title: '무엇이 로컬에 남는가',
          text: '미공개 음원, 가사, 영상 클립, 프로젝트 파일, 로컬 경로, 브라우저 세션, 외부 서비스 자격 정보는 사용자가 명시적으로 진단 정보를 내보내지 않는 한 사용자 PC에 남습니다.',
        },
        {
          title: '외부 도구와의 관계',
          text: '사용자의 Suno, Google Flow, ChatGPT, REAPER, DistroKid, YouTube 계정과 함께 작동합니다. 호환성을 설명하며, 공식 파트너십을 의미하지 않습니다.',
        },
        {
          title: '파일럿 지원 범위',
          text: '지원은 설치, 세팅, PapayaMusic Lab 사용 중 막히는 지점에 집중합니다. 무제한 제작 대행, 법률 자문, 외부 계정 관리, AI 결과물 품질 보장은 제외합니다.',
        },
        {
          title: '가격과 접근',
          text: 'Founder Pilot Studio는 첫 30일 기준 USD 199입니다. 이후 계속 사용과 비공개 업데이트는 30일 단위 USD 69로 수동 연장할 수 있습니다.',
        },
      ],
      operatingSteps: [
        {
          label: '1단계',
          title: '짧게 상황 공유',
          text: '지금 완성하려는 작업, 현재 병목, 이미 사용하는 도구를 간단히 공유합니다.',
          items: ['파일럿 신청 폼 사용', '비밀번호나 비공개 토큰은 제외', '답변에 필요한 맥락만 포함'],
        },
        {
          label: '2단계',
          title: '적합성, 가격, 범위 확인',
          text: '결제 전에 제품 적합성, 가격, 포함 지원, 제외 지원, 환불 조건을 확인합니다.',
          items: ['결제 전 질문 가능', '사용할 Windows PC 확인', '파일럿 시작 여부 결정'],
        },
        {
          label: '3단계',
          title: '가이드와 함께 설치',
          text: '결제 후 보호된 다운로드, 라이선스 활성화 도움, 세팅 가이드, 제작 작업 1회 리뷰를 받습니다.',
          items: ['보호된 Windows 빌드 설치', '라이선스 활성화', '세팅 중 막히는 지점을 필요한 맥락과 함께 공유'],
        },
      ],
    },
    footerEmailSubject: 'PapayaMusic Lab Founder Pilot 문의',
  },
  ja: {
    nav: {
      pilot: 'Founder Pilot',
      blog: 'ブログ',
      docs: 'ドキュメント',
    },
    brandSubtitle: 'Studio Suite',
    hero: {
      eyebrow: 'AI音楽スタジオと本気のソロ運用者のために',
      title: '生成された曲を、リリース可能な作品まで仕上げる。',
      lead:
        '生成候補を減らし、完成したリリースを増やしたいAI音楽スタジオとソロカタログ運用者のためのローカル制作スイートです。',
      primaryCta: 'Founder Pilotについて相談する',
      secondaryCta: '制作記録を読む',
      workflowLabel: '制作状態',
      consoleTitle: 'リリース準備記録',
      consoleSubtitle: 'Local production record',
      consoleStatus: 'レビュー準備',
      signalLabel: 'Production signal',
      signalValue: 'Evidence intact',
      renderLabel: '次のステップ',
      renderValue: 'パッケージ完成',
      publishLabel: '提出資料',
      publishValue: '準備済み',
      batchLabel: '現在の作業',
      batchValue: 'Pilot Project 01',
      timelineLabel: 'Release timeline',
      proof: ['ローカルインストール', '人の承認を維持', 'リリース準備記録'],
      tracks: [
        ['候補整理', '完了'],
        ['レビューノート', '準備済み'],
        ['メディア資料', '準備済み'],
        ['公開資料', '確認済み'],
      ],
    },
    target: {
      title: '向いているユーザー',
      items: ['AI音楽制作スタジオ', 'カタログを育てるソロ運用者', '生成後の工程が詰まっているチーム'],
    },
    toolchain: {
      eyebrow: '既存の制作ツールチェーン',
      title: 'すでに使っているAI音楽制作ツールと並んで動きます。',
      text:
        'PapayaMusic Labは既存の制作ツールを置き換えません。利用者自身のアカウントとデスクトップツールの周辺で制作運用を整理します。',
      tools: ['Suno', 'Google Flow', 'ChatGPT', 'REAPER', 'REAPER stock FX', 'DistroKid', 'YouTube'],
      note: '利用者自身のアカウントとライセンスを前提にします。ツール名は制作文脈を説明するためのもので、明記がない限り公式提携を意味しません。',
    },
    flow: [
      {
        title: '選ぶ',
        text: '生成候補を明確なリリース候補へ絞ります。',
      },
      {
        title: '仕上げる',
        text: 'リリースを完了するために必要な資料とノートを準備します。',
      },
      {
        title: '準備する',
        text: '最終資料を人の承認と公開準備の状態にします。',
      },
    ],
    positioning: {
      eyebrow: '制作システムとして設計',
      title: 'もう一つの生成器ではなく、生成後の運用レイヤー。',
      cards: [
        {
          title: '未完了の作業を減らす',
          text:
            '選別、ノート、メディア、公開準備を一つの制作習慣にまとめると、生成曲がリリースまで進みやすくなります。',
        },
        {
          title: '判断の文脈を保つ',
          text:
            '重要な判断とレビューノートが散らばらず、次の作業は記憶ではなく文脈から始められます。',
        },
        {
          title: 'ローカルメディアと作業する',
          text:
            '大きな音声・映像ファイルはlocal-firstで扱い、外部ツールは制作に必要な箇所でだけ併用します。',
        },
        {
          title: '最終判断は人が持つ',
          text:
            '製品はリリース資料の準備を助け、創作と公開の最終判断は明確に人へ残します。',
        },
      ],
    },
    outcome: {
      eyebrow: 'Operator outcome',
      title: '価値は生成ではなく、最後まで仕上げることにあります。',
      before: {
        label: 'Before',
        title: '生成候補が積み上がる',
        facts: ['37曲の候補', '散らばったプロンプト', '手作業の動画ファイル', 'チャット内の公開メモ'],
      },
      after: {
        label: 'After',
        title: '次へ進めるリリースが準備される',
        facts: ['選ばれたトラックセット', 'レビューノート準備済み', 'メディア資料準備済み', '公開コピー確認済み'],
      },
    },
    caseStudy: {
      eyebrow: 'Example run',
      title: '日々の運用で変わること。',
      cards: [
        {
          title: '繰り返しの選別を減らす',
          metric: '一つのリスト',
          text: '同じ候補をチャット、フォルダ、ノートの間で探し直す時間を減らします。',
        },
        {
          title: '次の行動が見える',
          metric: '一つの状態',
          text: '止まったプロジェクトを開き直しても、文脈を最初から作り直さずに済みます。',
        },
        {
          title: '安全に引き継ぐ',
          metric: '一つのパッケージ',
          text: 'リリースレビューと公開準備に必要な資料を一緒に残します。',
        },
      ],
    },
    pilot: {
      eyebrow: 'Founder Pilot',
      title: 'すでにこの問題がボトルネックなら申し込んでください。',
      checklistTitle: 'よく合うサイン',
      checklist: [
        'AI音楽を反復的な制作業務として扱うソロ運用者または小規模スタジオである。',
        '月に30曲以上の生成候補を管理している。',
        '選別、メタデータ、映像、公開、リリースレビューを手動で追跡している。',
        '曲は生成されるが、完成リリースまで進む割合が低い。',
      ],
      offer: {
        label: 'Pilot offer',
        title: 'USD 199',
        terms: [
          { label: '期間', value: '最初の30日' },
          { label: '以後', value: 'USD 69 / 30日' },
          { label: '更新', value: '手動選択' },
        ],
        itemsTitle: '含まれる内容',
        items: ['支援範囲の確認相談', '支払い後の保護されたWindowsダウンロードとライセンス', 'セットアップ支援', '一つの制作作業レビュー'],
        note: '支払いは適合確認の後に進めます。支援範囲と返金条件は支払い前に確認します。',
      },
      cards: [
        {
          title: '対象ユーザー',
          text:
            '十分な数の曲を生成していて、選別、メタデータ、マスタリングノート、メディア資料、公開作業がボトルネックになっているAI音楽制作スタジオと本気のソロ運用者向けです。',
        },
        {
          title: '含まれる内容',
          text:
            '保護された非公開ダウンロード、ライセンス有効化、セットアップ支援、early build、一つの実制作レビュー、セットアップ中の詰まりへの直接フィードバックを含みます。',
        },
        {
          title: 'サポート範囲',
          text:
            'サポートはインストール、セットアップ、PapayaMusic Lab利用中の詰まりに集中します。外部アカウント問題、法務助言、AI出力品質の保証、無制限の制作代行は範囲外です。',
        },
      ],
      requestCta: 'パイロットについて相談する',
      paymentCta: '確認後の支払い案内',
    },
    blog: {
      eyebrow: '制作ログ',
      title: 'リリース、MV、公開作業から残した制作記録。',
      readCta: '読む',
      allCta: 'ブログを開く',
      featuredLabel: '注目記事',
      archiveTitle: 'すべての記事',
      postCountLabel: '記事数',
      managerTitle: '制作ノート案内',
      managerText: '制作判断、運用上のトレードオフ、local-firstの選択を扱うノートです。',
      introText:
        'AI音楽制作がどこで止まりやすいか、最後まで仕上げるにはどんな判断が必要かを扱う短い運用ノートです。',
      sourceLabel: '範囲',
      sourceValue: '制作ノートと運用上の学び',
      rssCta: 'RSSフィード',
      backCta: 'ブログへ戻る',
    },
    docs: {
      eyebrow: 'Docs',
      title: 'Founder Pilotを始める前に確認すること。',
      introText:
        '製品の適合性、ローカルデータ、インストール、価格、支援範囲、相談後の流れを確認するための購入前ガイドです。',
      managerTitle: 'パイロット案内の概要',
      sourceLabel: '内容',
      sourceValue: 'パイロット適合性、ローカルデータ、アクセス、支援',
      depthLabel: '目的',
      depthValue: '申し込むべきか判断するための案内',
      readingTitle: 'このページで確認できること',
      readCta: '詳細なセットアップ案内は支払い後に提供',
      links: ['適合性', 'ローカルデータ', 'インストールとライセンス', '価格と支援'],
      readingOrder: [
        {
          label: '01',
          title: '自分の作業に合うか',
          text: 'Founder Pilotが誰に向いているか、どのAI音楽運用でlocal desktop方式が役立つかを説明します。',
        },
        {
          label: '02',
          title: '何が自分のPCに残るか',
          text: '未公開メディア、プロジェクトファイル、ローカルパス、アカウント関連情報が基本的にローカルに残る考え方を説明します。',
        },
        {
          label: '03',
          title: 'インストールと更新はどう進むか',
          text: '保護されたWindowsダウンロード、ライセンス有効化、セットアップ支援、更新案内で期待できる範囲を説明します。',
        },
        {
          label: '04',
          title: '何に支払うか',
          text: 'Founder Pilot Studioは最初の30日でUSD 199です。その後の継続利用は30日ごとにUSD 69で任意延長でき、パイロット中の自動更新はありません。',
        },
      ],
      operatingTitle: 'パイロット運用フロー',
      operatingIntro:
        '申し込み前に、製品の適合性、local-first境界、アクセスの流れ、支援範囲を確認できます。',
      trustTitle: '申し込み前に判断できること',
      trustIntro:
        '以下の項目は、有料アクセスの前にパイロットが現在の制作運用に合うか判断するための情報です。',
      trustCards: [
        {
          title: '何を支援するか',
          text: 'パイロットは生成後の作業に集中します。何を仕上げるか選び、レビュー文脈を保ち、リリース資料を準備し、反復的な手作業の追跡を減らすことに焦点を当てます。',
        },
        {
          title: '何がローカルに残るか',
          text: '未公開音源、歌詞、映像クリップ、プロジェクトファイル、ローカルパス、ブラウザセッション、外部サービス資格情報は、明示的に診断情報を書き出さない限りユーザーのPCに残ります。',
        },
        {
          title: '外部ツールとの関係',
          text: 'ユーザー自身のSuno、Google Flow、ChatGPT、REAPER、DistroKid、YouTubeアカウントと一緒に動作します。互換性を示すもので、公式提携を意味しません。',
        },
        {
          title: 'パイロット支援範囲',
          text: '支援はインストール、セットアップ、PapayaMusic Lab利用中の詰まりに集中します。無制限の制作代行、法務助言、外部アカウント管理、AI出力品質保証は含みません。',
        },
        {
          title: '価格とアクセス',
          text: 'Founder Pilot Studioは最初の30日でUSD 199です。その後の継続利用と非公開アップデートは30日ごとにUSD 69で手動延長できます。',
        },
      ],
      operatingSteps: [
        {
          label: 'Step 1',
          title: '状況を短く共有',
          text: '今仕上げたい作業、現在の詰まり、すでに使っているツールを簡単に共有します。',
          items: ['パイロット申込フォームを使う', 'パスワードや非公開トークンは含めない', '返信に必要な文脈だけを含める'],
        },
        {
          label: 'Step 2',
          title: '適合性、価格、範囲を確認',
          text: '支払い前に、製品の適合性、価格、含まれる支援、含まれない支援、返金条件を確認します。',
          items: ['支払い前に質問できる', '使用するWindows PCを確認', 'パイロットを始めるか決める'],
        },
        {
          label: 'Step 3',
          title: 'ガイド付きでインストール',
          text: '支払い後、保護されたダウンロード、ライセンス有効化支援、セットアップガイド、一つの制作作業レビューを受けます。',
          items: ['保護されたWindowsビルドをインストール', 'ライセンスを有効化', 'セットアップ中の詰まりを必要な文脈と一緒に共有'],
        },
      ],
    },
    footerEmailSubject: 'PapayaMusic Lab Founder Pilot',
  },
};

export const pilotContent = {
  en: {
    brandSubtitle: 'Founder Pilot',
    eyebrow: 'Founder Pilot Application',
    title: 'See whether the pilot fits your production flow.',
    lead:
      'Founder Pilot is a small, hands-on program. Tell us what you are trying to finish and where the work gets stuck, and we will reply with a useful next step.',
    backCta: 'Back to site',
    submitCta: 'Prepare email',
    copyCta: 'Copy summary',
    copied: 'Copied',
    copyFallback: 'Copy was blocked by the browser. Select the summary below.',
    privacy:
      'This static page does not store submissions. It prepares an email on your machine. Do not include passwords, OAuth files, private tokens, or unreleased customer data.',
    fitTitle: 'Best fit',
    fitItems: [
      'AI music studios managing repeat releases',
      'Solo catalog operators with growing track volume',
      'Teams that already use external generation, DAW, video, or publishing tools',
    ],
    reviewTitle: 'What helps us respond',
    reviewItems: [
      'Current bottleneck and production volume',
      'Local desktop fit and operating system',
      'Whether the pilot support scope matches the requested outcome',
    ],
    afterTitle: 'If it looks like a fit',
    afterItems: [
      'Payment and protected download instructions',
      'License activation for the intended machine',
      'Guided setup and one supported production review',
    ],
    formEyebrow: 'Application details',
    formTitle: 'Share a practical snapshot of your production process.',
    formIntro:
      'Short, practical answers are best. The goal is not to pitch the project; it is to understand what support would be useful for your current production work.',
    requiredNote: 'A few fields are needed to prepare a useful reply. The rest is optional.',
    requiredLabel: 'Needed',
    fields: {
      name: 'Name',
      email: 'Email',
      role: 'Role / project',
      catalogSize: 'How many AI-generated tracks do you manage per month?',
      currentTools: 'Current tools',
      bottleneck: 'Biggest bottleneck',
      goals: 'What would make this pilot successful?',
      operatingSystem: 'Operating system',
      notes: 'Anything else',
    },
    placeholders: {
      name: 'Your name',
      email: 'you@example.com',
      role: 'AI music studio, solo catalog operator, small production team...',
      catalogSize: 'Example: 50-200 candidates/month',
      currentTools: 'AI generation, chat, distribution, video, DAW, publishing tools...',
      bottleneck: 'Selection, metadata, mastering, media materials, publishing...',
      goals: 'Example: finish one release and one music video with less manual tracking',
      operatingSystem: 'Windows 11, macOS, etc.',
      notes: 'Links, constraints, preferred contact time...',
    },
    emailSubject: 'PapayaMusic Lab Founder Pilot Application',
    emailIntro: 'Founder Pilot application',
  },
  ko: {
    brandSubtitle: 'Founder Pilot',
    eyebrow: 'Founder Pilot 신청',
    title: '현재 제작 흐름에 맞는 지원 방식을 함께 확인합니다.',
    lead:
      'Founder Pilot은 소규모로 직접 지원하는 프로그램입니다. 지금 완성하려는 작업과 막히는 지점을 알려주시면, 적절한 다음 단계를 안내드립니다.',
    backCta: '사이트로 돌아가기',
    submitCta: '이메일 준비',
    copyCta: '요약 복사',
    copied: '복사됨',
    copyFallback: '브라우저가 복사를 막았습니다. 아래 요약을 선택해서 복사하세요.',
    privacy:
      '이 정적 페이지는 신청 내용을 저장하지 않습니다. 사용자의 컴퓨터에서 이메일 본문만 준비합니다. 비밀번호, OAuth 파일, private token, 미공개 고객 데이터는 넣지 마세요.',
    fitTitle: '적합한 대상',
    fitItems: [
      'AI 음악 릴리즈를 반복적으로 운영하는 스튜디오',
      '생성 트랙이 늘어나 관리 흐름이 필요한 1인 카탈로그 운영자',
      '생성, DAW, 영상, 퍼블리싱 도구를 이미 함께 쓰는 팀',
    ],
    reviewTitle: '답변에 도움이 되는 정보',
    reviewItems: [
      '현재 병목과 월간 제작 규모',
      '로컬 데스크톱 방식과 운영체제 적합성',
      '요청한 목표가 파일럿 지원 범위에 맞는지',
    ],
    afterTitle: '잘 맞는 경우',
    afterItems: [
      '결제와 보호된 다운로드 안내',
      '사용할 PC의 라이선스 활성화',
      '가이드 세팅과 제작 작업 1회 리뷰',
    ],
    formEyebrow: '신청 정보',
    formTitle: '현재 제작 흐름을 간단히 공유해 주세요.',
    formIntro:
      '짧고 실제적인 답변이면 충분합니다. 프로젝트를 홍보하기보다, 현재 제작 운영에 어떤 지원이 도움이 될지 이해하기 위한 정보입니다.',
    requiredNote: '몇 가지 항목만 답변 준비에 필요합니다. 나머지는 편하게 비워두셔도 됩니다.',
    requiredLabel: '필요',
    fields: {
      name: '이름',
      email: '이메일',
      role: '역할 / 프로젝트',
      catalogSize: '한 달에 관리하는 AI 생성 트랙 수',
      currentTools: '현재 사용하는 도구',
      bottleneck: '가장 큰 병목',
      goals: '파일럿이 성공했다고 느끼는 기준',
      operatingSystem: '운영체제',
      notes: '기타',
    },
    placeholders: {
      name: '이름',
      email: 'you@example.com',
      role: 'AI 음악 스튜디오, 1인 카탈로그 운영자, 소규모 제작팀...',
      catalogSize: '예: 월 50-200개 후보',
      currentTools: 'AI 생성, 채팅, 배포, 영상, DAW, 퍼블리싱 도구...',
      bottleneck: '선별, 메타데이터, 마스터링, 미디어 자료, 퍼블리싱...',
      goals: '예: 수동 추적을 줄이고 릴리즈 1개와 뮤직비디오 1개 완성',
      operatingSystem: 'Windows 11, macOS 등',
      notes: '링크, 제약, 연락 가능 시간...',
    },
    emailSubject: 'PapayaMusic Lab Founder Pilot 신청',
    emailIntro: 'Founder Pilot 신청',
  },
  ja: {
    brandSubtitle: 'Founder Pilot',
    eyebrow: 'Founder Pilot Application',
    title: '現在の制作フローに合う支援方法を一緒に確認します。',
    lead:
      'Founder Pilotは小規模で直接支援するプログラムです。今仕上げたい作業と詰まっている箇所を共有いただければ、適切な次の進め方を返信します。',
    backCta: 'サイトに戻る',
    submitCta: 'メールを準備',
    copyCta: '要約をコピー',
    copied: 'コピー済み',
    copyFallback: 'ブラウザがコピーをブロックしました。下の要約を選択してコピーしてください。',
    privacy:
      'この静的ページは送信内容を保存しません。あなたのマシン上でメール本文を準備します。パスワード、OAuthファイル、private token、未公開の顧客データは入力しないでください。',
    fitTitle: '適している対象',
    fitItems: [
      'AI音楽リリースを継続的に運用するスタジオ',
      '生成トラックが増え、管理フローが必要なソロカタログ運用者',
      '生成、DAW、映像、公開ツールをすでに併用しているチーム',
    ],
    reviewTitle: '返信に役立つ情報',
    reviewItems: [
      '現在の詰まりと月間制作量',
      'ローカルデスクトップ方式とOSの適合性',
      '希望する成果がパイロット支援範囲に合うか',
    ],
    afterTitle: '合いそうな場合',
    afterItems: [
      '支払いと保護されたダウンロード案内',
      '使用予定PCでのライセンス有効化',
      'セットアップ支援と一つの制作作業レビュー',
    ],
    formEyebrow: '申込情報',
    formTitle: '現在の制作フローを簡単に共有してください。',
    formIntro:
      '短く実務的な回答で十分です。プロジェクト紹介ではなく、現在の制作運用にどんな支援が役立つか理解するための情報です。',
    requiredNote: 'いくつかの項目だけ返信準備に必要です。その他は任意です。',
    requiredLabel: '必要',
    fields: {
      name: '名前',
      email: 'メール',
      role: '役割 / プロジェクト',
      catalogSize: '月に管理するAI生成トラック数',
      currentTools: '現在使っているツール',
      bottleneck: '最大のボトルネック',
      goals: 'パイロット成功の条件',
      operatingSystem: 'OS',
      notes: 'その他',
    },
    placeholders: {
      name: '名前',
      email: 'you@example.com',
      role: 'AI音楽スタジオ、ソロカタログ運用者、小規模制作チーム...',
      catalogSize: '例: 月50-200候補',
      currentTools: 'AI生成、チャット、配信、映像、DAW、公開ツール...',
      bottleneck: '選別、メタデータ、マスタリング、メディア資料、公開...',
      goals: '例: 手作業の追跡を減らし、1つのリリースとMVを完成させる',
      operatingSystem: 'Windows 11, macOS など',
      notes: 'リンク、制約、連絡しやすい時間...',
    },
    emailSubject: 'PapayaMusic Lab Founder Pilot Application',
    emailIntro: 'Founder Pilot application',
  },
};

export function getHomeContent(language) {
  return homeContent[language] ?? homeContent[fallbackLanguage];
}

export function getPilotContent(language) {
  return pilotContent[language] ?? pilotContent[fallbackLanguage];
}
