const local = (name) => `/assets/deres360/${name}`
const carousel = [
  'carrossel-02.webp', 'carrossel-04.webp', 'carrossel-05.webp',
  'carrossel-06.webp', 'carrossel-07.webp', 'carrossel-08.webp', 'carrossel-09.webp',
  'carrossel-10.webp', 'carrossel-11.webp',
].map(local)
const cloudflareAssets = 'https://pub-4d8c6aa6a7554bbca9c84f3e351de5f0.r2.dev/assets-lp/'

export const lpAssets = {
  logo: local('logo.webp'),
  heroMockup: local('hero-deres360.webp'),
  diagnosticsMainImage: carousel[1],
  diagnosticsCarouselImages: carousel,
  urgencyCarouselImages: carousel,
  checklistIcons: {
    printer: `${cloudflareAssets}impressora.webp`,
    organization: `${cloudflareAssets}icone%20organiza%C3%A7%C3%A3o.webp`,
    checklistPaper: `${cloudflareAssets}icone%20papel%20checklist.webp`,
    calendar: `${cloudflareAssets}icone%20calendario.webp`,
  },
  packageMockup: carousel[1],
  bonusImages: [
    local('bonus-01-perguntas-v2.webp'),
    local('bonus-02-personagens-v2.webp'),
    local('bonus-03-plano-365.webp'),
    local('bonus-04-versiculos-200.webp'),
    local('bonus-05-antigo-testamento.webp'),
    local('bonus-06-novo-testamento.webp'),
  ],
  planBasicMockup: local('plano-basico-mockup.webp'),
  planCompleteMockup: local('plano-completo-mockup.webp'),
  paymentIcons: local('payment-methods-deres360.webp'),
  guaranteeSeal: 'https://origin.mentoriaprocesso.com/img/5afc6802-7b23-4428-aa4c-fe7f86e07546/d08bb98d-db0f-451f-aa55-124b86c1d482/garantia-selo-1784288640730.webp',
  accessSteps: {
    order: `${cloudflareAssets}como%20%C3%A9%20o%20acesso/order.webp`,
    memberArea: `${cloudflareAssets}como%20%C3%A9%20o%20acesso/area%20de%20membros.webp`,
    downloads: `${cloudflareAssets}como%20%C3%A9%20o%20acesso/baixe%20os%20arquivos.webp`,
    usage: `${cloudflareAssets}como%20%C3%A9%20o%20acesso/use%20o%20atendimento.webp`,
  },
}
