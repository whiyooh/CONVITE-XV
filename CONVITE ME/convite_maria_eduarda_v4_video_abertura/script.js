const modalLayer = document.getElementById("modal-layer");
const modalContent = document.getElementById("modal-content");
const openingVideo = document.getElementById("opening-video");

let currentModal = null;
let isModalTransitioning = false;
let openingTimer = null;

const VIDEO_FALLBACK_TIME = 8000;

const modals = {
  manual: {
    eyebrow: "Manual",
    title: "Manual do Convidado",
    image: "https://lajedo.com.br/wp-content/uploads/2022/11/festa-15-anos-rosa-arranjos-aereos.jpg",
    body: `
      <p>Para manter a festa elegante e dentro da proposta visual da noite, siga estas orientações:</p>
      <ul>
        <li>Traje sugerido: esporte fino.</li>
        <li>Evite tons muito próximos ao rosa principal da debutante.</li>
        <li>Chegue com alguns minutos de antecedência.</li>
        <li>Prepare-se para fotos, música e uma noite especial.</li>
      </ul>
    `
  },

  gifts: {
    eyebrow: "Presentes",
    title: "Sugestões",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80",
    body: `
      <p>Algumas ideias simples para ajudar na escolha do presente:</p>
      <ul>
        <li> Roupas tamanho : M, G</li>
        <li>Calçado : 36</li>
        <li>Acessórios e maquiagem.</li>
        <li>Bolsas e lembrançinhas.</li>
      </ul>
    `
  },

  location: {
    eyebrow: "Festa",
    title: "Localização",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
    body: `
      <p><strong>Espaço da Festa</strong></p>
      <p> Buffet Uriel - Estr. dos Pinheiros, 70 - Parque Viana - Barueri<br></p>

      <div class="modal-actions">
        <a class="button" href="https://www.google.com/maps/search/?api=1&query=Buffet%20Uriel%20Estr.%20dos%20Pinheiros%2070%20Parque%20Viana%20Barueri" target="_blank" rel="noopener">
          Abrir no Google Maps
        </a>
      </div>
    `
  },

  rsvp: {
    eyebrow: "Confirmação",
    title: "Confirmar Presença",
    image: "https://www.espacopuzzle.com.br/blog/img/blog24.webp",
    body: `
      <p>Toque no botão abaixo para confirmar sua presença no XV da Maria Eduarda.</p>

      <div class="modal-actions">
      <a
  class="button"
  href="https://wa.me/5511969064545?text=Olá!%20Estou%20confirmando%20minha%20presença%20no%20XV%20da%20Maria%20Eduarda%20✨%0A%0ANome:%0AQuantidade%20de%20acompanhantes:"
  target="_blank"
  rel="noopener"
>
  Confirmar presença
</a>
      </div>
    `
  }
};

function goToScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
  }
}

function openPrintedEnvelope() {
  const envelope = document.querySelector(".printed-envelope");

  if (!envelope) return;

  envelope.classList.add("open");

  setTimeout(() => {
    goToScreen("screen-pre-invite");
  }, 1150);
}

function startOpeningVideo() {
  goToScreen("screen-video");

  const progress = document.querySelector(".progress");

  progress.classList.remove("running");
  void progress.offsetWidth;
  progress.classList.add("running");

  if (openingVideo) {
    openingVideo.currentTime = 0;
    openingVideo.volume = 0.5;
    openingVideo.muted = false;

    openingVideo.play().catch(() => {
      console.warn("O navegador bloqueou a reprodução automática com áudio.");
    });
  }

  clearTimeout(openingTimer);

  openingTimer = setTimeout(() => {
    finishOpeningVideo();
  }, 8000);
}

function finishOpeningVideo() {
  clearTimeout(openingTimer);

  if (openingVideo) {
    openingVideo.pause();
    openingVideo.currentTime = 0;
  }

  goToScreen("screen-invite");
}

function openModal(type) {
  if (isModalTransitioning) return;
  if (!modals[type]) return;
  if (!modalLayer || !modalContent) return;

  isModalTransitioning = true;
  currentModal = type;

  const modal = modals[type];

  modalContent.innerHTML = `
    <div class="modal-hero">
      <img src="${modal.image}" alt="" />
      <div class="modal-title-over">
        <p>${modal.eyebrow}</p>
        <h2 id="modal-title">${modal.title}</h2>
      </div>
    </div>

    <div class="modal-body">
      ${modal.body}

      ${type !== "rsvp" && type !== "location" ? `
        <div class="modal-actions">
          <button class="button" type="button" onclick="closeModal()">Fechar</button>
        </div>
      ` : ""}
    </div>
  `;

  modalLayer.classList.add("active");
  modalLayer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    isModalTransitioning = false;
  }, 360);
}

function closeModal() {
  if (!modalLayer || !modalContent) return;

  modalLayer.classList.remove("active");
  modalLayer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  currentModal = null;

  setTimeout(() => {
    if (!modalLayer.classList.contains("active")) {
      modalContent.innerHTML = "";
    }
  }, 260);
}

function confirmPresence() {
  if (!modalContent) return;

  currentModal = "confirmed";

  modalContent.innerHTML = `
    <div class="confirmed-state">
      <div class="confirmed-symbol">✓</div>
      <h2 id="modal-title">Presença confirmada</h2>
      <p>Sua presença foi confirmada com sucesso. Maria Eduarda ficará muito feliz em receber você.</p>

      <div class="modal-actions">
        <button class="button" type="button" onclick="closeModal()">
          Fechar
        </button>
      </div>
    </div>
  `;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalLayer?.classList.contains("active")) {
    closeModal();
  }
});
