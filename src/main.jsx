import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  Check,
  ChevronDown,
  FolderOpen,
  Mail,
  MonitorSmartphone,
  ShieldCheck,
  ShoppingCart,
  Wrench,
} from 'lucide-react'
import { lpAssets } from './lp-assets'
import './styles.css'

const A = '/assets/'

const CHECKOUT_CONFIG = {
  basico: {
    url: 'https://checkout.lincelabs.online/c/t9nflah?offer=0s3o7puprg',
    productName: 'DERES 360º - Plano Básico',
    productId: 'plan_basico',
    price: 9.90,
    currency: 'BRL'
  },
  completo: {
    url: 'https://checkout.lincelabs.online/c/t9nflah',
    productName: 'DERES 360º - Plano Completo',
    productId: 'plan_completo',
    price: 19.90,
    currency: 'BRL'
  }
}

function waitForAdTrack(timeoutMs = 2500) {
  if (window.adtrack) return Promise.resolve(window.adtrack)

  return new Promise((resolve) => {
    let done = false
    const timer = setTimeout(() => {
      if (done) return
      done = true
      resolve(window.adtrack || null)
    }, timeoutMs)

    window.addEventListener('adtrack:ready', () => {
      if (done) return
      done = true
      clearTimeout(timer)
      resolve(window.adtrack || null)
    }, { once: true })
  })
}

async function goToCheckout(event, checkoutKey) {
  if (event && event.preventDefault) event.preventDefault()

  const config = CHECKOUT_CONFIG[checkoutKey]
  if (!config) {
    window.location.href = event.currentTarget.href
    return
  }

  const adtrack = await waitForAdTrack()
  if (!adtrack) {
    console.error('AdTrack não carregou. O checkout não foi aberto para evitar perda de atribuição.')
    return
  }

  const checkoutData = {
    product_name: config.productName,
    product_id: config.productId
  }

  const decoratedUrl = adtrack.decorateCheckoutUrl(config.url)

  try {
    await adtrack.saveCheckoutClick(config.productName, config.productId, checkoutData)
  } catch (error) {
    console.warn('AdTrack checkout click falhou, redirecionando mesmo assim', error)
  }

  adtrack.trackInitiateCheckout(config.price, config.currency, 1, checkoutData)

  window.location.href = decoratedUrl
}

function Cta({ children = 'QUERO ACESSAR AGORA', className = '', href = '#oferta', checkoutKey = null }) {
  if (checkoutKey) {
    const config = CHECKOUT_CONFIG[checkoutKey]
    return (
      <a
        href={href}
        className={`cta ${className}`}
        data-product-name={config?.productName}
        data-product-id={config?.productId}
        onClick={(e) => goToCheckout(e, checkoutKey)}
      >
        {children}
      </a>
    )
  }
  return (
    <a href={href} className={`cta ${className}`}>
      {children}
    </a>
  )
}

function CheckLine({ children, dark = false }) {
  return (
    <li className={dark ? 'check-line check-line-dark' : 'check-line'}>
      <Check size={17} strokeWidth={3.4} />
      <span>{children}</span>
    </li>
  )
}

function shuffleImages(images) {
  const shuffled = [...images]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  return shuffled
}

function RandomCarousel({ images, dark = false, alt = 'Prévia dos materiais de estudo' }) {
  const orderedImages = useMemo(() => shuffleImages(images), [images])
  const [activeIndex, setActiveIndex] = useState(0)
  const viewportRef = useRef(null)

  const scrollToIndex = (index) => {
    const viewport = viewportRef.current
    const firstImage = viewport?.querySelector('img')
    const track = viewport?.querySelector('.carousel-strip')
    if (!viewport || !firstImage || !track) return

    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0
    const step = firstImage.getBoundingClientRect().width + gap
    viewport.scrollTo({ left: index * step, behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToIndex(activeIndex)
  }, [activeIndex])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % orderedImages.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [orderedImages.length])

  const move = (amount) => {
    setActiveIndex((current) => (current + amount + orderedImages.length) % orderedImages.length)
  }

  return (
    <div className={dark ? 'carousel-component carousel-dark' : 'carousel-component'}>
      <div className="carousel-window" ref={viewportRef}>
        <div className="carousel-strip">
          {orderedImages.map((src, index) => (
            <img key={`${src}-${index}`} src={src} alt={alt} />
          ))}
        </div>
      </div>
      <div className="carousel-controls" aria-label="Controles dos materiais">
        <button type="button" className="carousel-arrow" onClick={() => move(-1)} aria-label="Imagem anterior">‹</button>
        <div className="carousel-dots">
          {orderedImages.map((src, index) => (
            <button
              type="button"
              key={`dot-${src}`}
              className={index === activeIndex ? 'carousel-dot is-active' : 'carousel-dot'}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ir para a imagem ${index + 1}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
        <button type="button" className="carousel-arrow" onClick={() => move(1)} aria-label="Próxima imagem">›</button>
      </div>
    </div>
  )
}

const benefitCards = [
  ['Começar pelo essencial', 'Avance de explicações simples para o contexto de livros, personagens e acontecimentos bíblicos.'],
  ['Encontrar tudo em um só lugar', 'Consulte guias, mapas, resumos e referências reunidos em uma biblioteca digital organizada.'],
  ['Estudar no seu ritmo', 'Use os materiais antes, durante ou entre os encontros, pelo celular ou computador.'],
  ['Compreender as passagens', 'Leia explicações organizadas para acompanhar melhor o texto bíblico e suas referências.'],
  ['Visualizar o contexto', 'Use mapas, linhas do tempo e esquemas para enxergar a sequência dos acontecimentos.'],
  ['Criar uma rotina', 'Tenha um roteiro de leitura e materiais de consulta para continuar aprendendo durante a semana.'],
]

const receiveItems = [
  'Bíblia Explicada Versículo por Versículo',
  'Bíblia de A a Z — Explicação Simples e Didática',
  'Panorama das Escrituras — 150 Recursos Visuais',
  'Evangelho de Mateus Explicado',
  'Explicações, mapas, linhas do tempo e resumos organizados',
  'Arquivos digitais para celular ou computador',
  'Acesso imediato após a confirmação do pagamento',
  'Pagamento único, sem mensalidade',
]

const trustCards = [
  'Acesso imediato',
  'Pagamento único',
  'Compra 100% segura',
  'Garantia de 30 dias',
]

const bonuses = [
  ['BÔNUS 01', '100 Perguntas Difíceis da Bíblia Respondidas', 'Encontre explicações organizadas para dúvidas que surgem durante a leitura das Escrituras.'],
  ['BÔNUS 02', '100 Personagens Bíblicos Explicados', 'Conheça personagens importantes, suas histórias e a relação deles com os acontecimentos bíblicos.'],
  ['BÔNUS 03', 'Plano Cronológico da Bíblia em 365 Dias', 'Tenha um roteiro diário organizado para acompanhar a sequência histórica dos acontecimentos bíblicos.'],
  ['BÔNUS 04', '200 Versículos Mais Reveladores', 'Uma seleção de passagens marcantes para consulta, leitura e reflexão pessoal.'],
  ['BÔNUS 05', '100 Versículos do Antigo Testamento Explicados', 'Estude uma seleção de versículos do Antigo Testamento com explicações didáticas.'],
  ['BÔNUS 06', '100 Versículos do Novo Testamento Explicados', 'Consulte uma seleção de versículos do Novo Testamento acompanhados de explicações.'],
]

const faqs = [
  ['Serve para quem nunca estudou a Bíblia?', 'Sim. Os materiais usam linguagem simples, recursos visuais e guias que ajudam quem está começando a organizar o próprio estudo.'],
  ['O material é físico ou digital?', 'É uma coleção digital. Você não recebe livros impressos pelos Correios.'],
  ['Quando recebo o acesso?', 'Após a confirmação do pagamento, as instruções de acesso são enviadas pelos canais informados na compra. Confirme o prazo e os canais reais antes de publicar.'],
  ['Posso estudar pelo celular?', 'Sim. A proposta é permitir a consulta pelo celular ou computador, conforme o formato de entrega disponibilizado.'],
  ['Posso imprimir?', 'Verifique as condições de uso de cada material e confirme se os PDFs podem ser impressos para uso pessoal.'],
  ['Qual a diferença entre os planos?', 'O Plano Básico inclui os 4 materiais principais. O Plano Completo inclui os mesmos 4 materiais e mais 6 materiais bônus, totalizando 10 materiais digitais.'],
  ['Tem mensalidade e garantia?', 'Não há mensalidade. A oferta prevê 30 dias de garantia, sujeitos às condições apresentadas no checkout.'],
]

function Hero() {
  return (
    <section className="hero">
      <div className="urgency">⚡ OFERTA ESPECIAL DISPONÍVEL APENAS HOJE</div>
      <div className="hero-inner">
        <img className="brand-logo" src={lpAssets.logo} alt="DERES 360º Estudos Bíblicos" />
        <div className="pill">Biblioteca digital de estudos bíblicos</div>
        <h1>O DERES ainda não chegou à sua região? Seus estudos bíblicos podem começar hoje.</h1>
        <p>Materiais para ler, consultar e compreender melhor as Escrituras — mesmo que ainda não existam encontros do DERES na sua cidade.</p>
        <div className="hero-product">
          <img src={lpAssets.heroMockup} alt="Materiais digitais de estudos bíblicos" />
        </div>
        <div className="hero-copy">
          <p>Tenha no celular uma coleção de materiais para ler, consultar e compreender melhor as Escrituras. Se você já participa, use os conteúdos para continuar estudando entre os encontros, no seu próprio ritmo.</p>
          <p>Você recebe explicações versículo por versículo, mapas, resumos visuais e guias didáticos. Até 10 materiais, conforme o plano escolhido.</p>
          <ul className="hero-feature-list">
            <CheckLine dark>Explicações simples e didáticas</CheckLine>
            <CheckLine dark>Mapas, linhas do tempo e resumos visuais</CheckLine>
            <CheckLine dark>Materiais para estudar pelo celular ou computador</CheckLine>
            <CheckLine dark>Plano Básico com 4 materiais ou Completo com 10</CheckLine>
            <CheckLine dark>Pagamento único e acesso digital</CheckLine>
          </ul>
          <Cta>QUERO COMEÇAR MEUS ESTUDOS</Cta>
          <div className="hero-instant"><Mail size={15} /> Acesso após a confirmação do pagamento</div>
        </div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section className="intro section-dark">
      <div className="container two-col">
        <div>
          <p>Comece por explicações simples e avance para o contexto dos livros, personagens e acontecimentos bíblicos. Não importa se você está começando ou se já costuma ler a Bíblia.</p>
          <p>Chega de depender de explicações soltas e materiais espalhados. Consulte os conteúdos de forma organizada, com guias, mapas, resumos e referências reunidos em uma coleção digital.</p>
        </div>
        <ul className="feature-list">
          <CheckLine dark>Estudo pessoal antes, durante e entre os encontros</CheckLine>
          <CheckLine dark>Explicações organizadas por versículos e assuntos</CheckLine>
          <CheckLine dark>Mapas, resumos e esquemas para visualizar o contexto</CheckLine>
          <CheckLine dark>Consulta pelo celular ou computador</CheckLine>
          <CheckLine dark>Pagamento único e acesso digital</CheckLine>
          <li><Cta>QUERO CONHECER TODOS OS MATERIAIS</Cta></li>
          <li className="instant"><Mail size={18} /> Acesso após a confirmação do pagamento</li>
        </ul>
      </div>
    </section>
  )
}

function DiagnosticsPreview() {
  return (
    <section className="preview beige">
      <div className="container center">
        <h2>VEJA COMO SÃO OS MATERIAIS QUE VOCÊ VAI RECEBER</h2>
        <img className="phone-preview" src={lpAssets.diagnosticsMainImage} alt="Demonstração dos materiais de estudo" />
      </div>
      <RandomCarousel images={lpAssets.diagnosticsCarouselImages} />
      <div className="container checklist">
        <h3>OS MATERIAIS POSSUEM:</h3>
        {[
            'Explicações organizadas por versículos e assuntos para facilitar a consulta.',
            'Mapas, linhas do tempo, personagens e resumos para visualizar o contexto.',
            'Coleção digital para estudar pelo celular ou computador.',
            'Pagamento único e acesso conforme as condições informadas na compra.',
        ].map((text, index) => (
          <article key={text} className="check-card">
            <img src={[
              lpAssets.checklistIcons.printer,
              lpAssets.checklistIcons.organization,
              lpAssets.checklistIcons.checklistPaper,
              lpAssets.checklistIcons.calendar,
            ][index]} alt="" />
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function OfferBreak() {
  return (
    <section className="offer-break">
      <div className="container center">
        <p className="red-kicker">APROVEITE A OFERTA POR TEMPO LIMITADO</p>
        <h2>Aproveite a oferta por tempo limitado</h2>
        <Cta>QUERO ESTUDAR COM MAIS CLAREZA</Cta>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="benefits">
      <div className="container">
        <h2>ESTE MATERIAL É IDEAL PARA VOCÊ QUE DESEJA</h2>
        <div className="benefit-grid">
          {benefitCards.map(([title, body]) => (
            <article className="benefit-card" key={title}>
              <Check size={16} strokeWidth={4} />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Receive() {
  return (
    <section className="receive beige">
      <div className="container">
        <h2>TUDO O QUE VOCÊ VAI RECEBER</h2>
        <div className="receive-panel">
          <div className="green-pill">⚡ ACESSO IMEDIATO</div>
          <h3>TUDO FOI ORGANIZADO PARA VOCÊ ESTUDAR NO SEU RITMO.</h3>
          <p>Escolha por onde começar, consulte os materiais quando quiser e continue aprendendo mesmo fora dos encontros presenciais.</p>
          <img src={lpAssets.packageMockup} alt="Kit digital DERES 360º" />
          <ul>{receiveItems.map((item) => <CheckLine dark key={item}>{item}</CheckLine>)}</ul>
        </div>
        <div className="assurance-grid" aria-label="Garantias da oferta">
          {trustCards.map((item) => (
            <article className="assurance-card" key={item}>
              <Check size={20} strokeWidth={3.2} />
              <strong>{item}</strong>
            </article>
          ))}
        </div>
        <div className="bonus-title">
          <h2>E NÃO PARA POR AÍ... TEM MAIS!</h2>
          <p>Você também vai receber...</p>
          <span>🎁 6 BÔNUS EXCLUSIVOS</span>
        </div>
        <div className="bonus-grid">
          {bonuses.map(([tag, title, body], index) => (
            <article className="bonus-card" key={tag}>
              <div className="bonus-image"><span>{tag}</span><img src={lpAssets.bonusImages[index]} alt={title} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="free">Incluído no Plano Completo</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const basic = ['Bíblia Explicada Versículo por Versículo', 'Bíblia de A a Z — Explicação Simples e Didática', 'Panorama das Escrituras — 150 Recursos Visuais', 'Evangelho de Mateus Explicado']
  const complete = [...basic, '🎁 100 Perguntas Difíceis da Bíblia Respondidas', '🎁 100 Personagens Bíblicos Explicados', '🎁 Plano Cronológico da Bíblia em 365 Dias', '🎁 200 Versículos Mais Reveladores', '🎁 100 Versículos do Novo Testamento Explicados', '🎁 100 Versículos do Antigo Testamento Explicados']
  return (
    <section id="oferta" className="pricing">
      <div className="container">
        <div className="orange-pill">🔥 ÚLTIMA CHANCE — OFERTA TERMINA HOJE</div>
        <h2>ESCOLHA A MELHOR OPÇÃO PARA VOCÊ</h2>
        <div className="price-grid">
          <Plan title="PLANO COMPLETO" items={complete} price="R$ 19,90" old="R$ 97,00" installments="pagamento único" saving="R$ 77,10" img={lpAssets.planCompleteMockup} cta="QUERO O PLANO COMPLETO" checkoutKey="completo" featured />
          <Plan title="PLANO BÁSICO" items={basic} price="R$ 9,90" old="R$ 47,00" installments="pagamento único" saving="R$ 37,10" img={lpAssets.planBasicMockup} cta="QUERO O PLANO BÁSICO" checkoutKey="basico" />
        </div>
        <div className="payment-card">
          <h3>Meios de pagamento</h3>
          <img className="payment-icons" src={lpAssets.paymentIcons} alt="Meios de pagamento" />
          <p><Check size={17} /> Pagamento único e compra segura.</p>
        </div>
        <div className="safe-box"><ShieldCheck size={28} /><div><strong>Você escolhe o plano que faz sentido para o seu momento.</strong><p>Tenha os materiais digitais organizados para consultar quando quiser.</p></div></div>
        <p className="secure">🔒 Compra 100% segura e garantida.</p>
      </div>
    </section>
  )
}

function Plan({ title, items, price, old, installments, saving, img, cta, checkoutKey, featured = false }) {
  const config = CHECKOUT_CONFIG[checkoutKey]
  const href = config ? config.url : '#oferta'
  
  return (
    <article className={featured ? 'plan plan-featured' : 'plan'}>
      {featured && <div className="best">⚡ MAIS VENDIDO</div>}
      {featured && <div className="mini-orange">🔥 ÚLTIMA CHANCE — OFERTA TERMINA HOJE</div>}
      <h3>{title}</h3>
      <img src={img.startsWith('http') || img.startsWith('/') ? img : `${A}${img}`} alt={title} />
      {featured && <div className="combo">⚡4 materiais principais + 6 bônus</div>}
      <p className="you-receive">Você recebe:</p>
      <ul>{items.map((item) => <CheckLine dark={featured} key={item}>{item}</CheckLine>)}</ul>
      <p className="old">de <s>{old}</s> por:</p>
      <div className="price">{price}</div>
      <p className="installments">{installments}</p>
      <p className="save">● Você economiza {saving}</p>
      <Cta href={href} checkoutKey={checkoutKey}>{cta}</Cta>
    </article>
  )
}

function Guarantee() {
  return (
    <section className="guarantee">
      <div className="container guarantee-wrap">
        <img src={lpAssets.guaranteeSeal} alt="Garantia de 30 dias" />
        <div>
          <p className="guarantee-label">Garantia de 30 dias</p>
          <h2>GARANTIA DE 30 DIAS - ZERO RISCO PRA VOCÊ</h2>
          <p>Isso significa que, durante 30 dias, se você perceber que:</p>
          <ul>
            <li>o material não é o que você esperava.</li>
            <li>a coleção não atende ao seu momento de estudo.</li>
            <li>ou simplesmente não quer continuar com a compra.</li>
          </ul>
          <p>Você poderá solicitar o reembolso conforme as condições informadas na compra. O risco fica do nosso lado.</p>
        </div>
      </div>
    </section>
  )
}

function AccessFaq() {
  return (
    <section className="access beige">
      <div className="container">
        <h2>COMO É O ACESSO</h2>
        <p className="sub">(Veja como é simples acessar os materiais)</p>
        <div className="steps">
          <Step icon={<ShoppingCart />} title="Conclua sua compra" image={lpAssets.accessSteps.order} items={['Pagamento seguro', 'Confirmação do pedido', 'Acesso conforme a oferta']}>Depois do pagamento, você recebe as instruções de acesso.</Step>
          <Step icon={<MonitorSmartphone />} title="Entre na área de membros" image={lpAssets.accessSteps.memberArea} items={['Visualização fácil', 'Materiais organizados', 'Consulta rápida']}>Acesse o painel com os conteúdos do seu plano.</Step>
          <Step icon={<FolderOpen />} title="Baixe os arquivos" image={lpAssets.accessSteps.downloads} items={['Arquivos digitais', 'Leitura no celular', 'Organização simples']}>Guarde os materiais para consultar quando quiser.</Step>
          <Step icon={<Wrench />} title="Comece seus estudos" image={lpAssets.accessSteps.usage} items={['Escolha por onde começar', 'Estude no seu ritmo', 'Continue entre os encontros']}>Abra um material e avance com mais clareza.</Step>
        </div>
        <div className="center"><Cta /></div>
        <Faq />
      </div>
    </section>
  )
}

function Step({ icon, title, image, items, children }) {
  return (
    <article className="step">
      <div className="step-icon">{icon}</div>
      <img src={image} alt="" />
      <h3>{title}</h3>
      <p>{children}</p>
      <ul>{items.map((item) => <CheckLine key={item}>{item}</CheckLine>)}</ul>
    </article>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq">
      <h2>PERGUNTAS FREQUENTES</h2>
      {faqs.map(([question, answer], index) => (
        <article className="faq-item" key={question}>
          <button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
            <span>{question}</span>
            <ChevronDown className={open === index ? 'rotate' : ''} />
          </button>
          {open === index && <p>{answer}</p>}
        </article>
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer>
      <p>DERES 360º — Estudos bíblicos onde você estiver.</p>
      <p>O DERES 360º é um produto educacional digital e independente, destinado a pessoas interessadas em aprofundar o estudo pessoal das Escrituras. Não é um produto oficial, não é promovido, autorizado ou endossado pela Congregação Cristã no Brasil (CCB) nem pelo Departamento de Reuniões de Evangelização para Estudantes (DERES). A compra não inclui inscrição, participação ou acesso aos encontros oficiais do DERES.</p>
      <p>© 2026 DERES 360º. Todos os direitos reservados.</p>
    </footer>
  )
}

function Home() {
  return (
    <main>
      <Hero />
      <DiagnosticsPreview />
      <OfferBreak />
      <Benefits />
      <Receive />
      <Pricing />
      <Guarantee />
      <AccessFaq />
      <Footer />
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
