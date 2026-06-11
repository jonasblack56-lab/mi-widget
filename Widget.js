(function() {
  'use strict';

  // ============================================
  //  CONFIGURACIÓN DE DONANTES - PERSONALIZABLE
  // ============================================
  const DONANTES = [
    { nombre: "María González", monto: 5000, mensaje: "¡Ánimo con la causa!" },
    { nombre: "Carlos Rodríguez", monto: 3500, mensaje: "Con mucho cariño" },
    { nombre: "Ana Martínez", monto: 2800, mensaje: "" },
    { nombre: "Juan Pérez", monto: 2500, mensaje: "¡Éxitos!" },
    { nombre: "Laura Sánchez", monto: 2200, mensaje: "Para ayudar en lo que pueda" },
    { nombre: "Roberto Lima", monto: 2000, mensaje: "" },
    { nombre: "Patricia Torres", monto: 1800, mensaje: "Un granito de arena" },
    { nombre: "Miguel Ángel", monto: 1500, mensaje: "¡Fuerza!" },
    { nombre: "Carmen Flores", monto: 1200, mensaje: "" },
    { nombre: "Diego Ramírez", monto: 1000, mensaje: "Saludos" }
  ];

  const CONFIG = {
    recaudado: 28050,
    objetivo: 35000,
    donantes: 675,
    nombreDonante: "Christine Helse...",
    duracionAnimacion: 2000,
    formatoMoneda: "USD",
    // ✅ NUEVA CONFIGURACIÓN
    redirectUrl: '/', // URL de la página principal (cambia esto si tu página no está en la raíz)
    redirectDelay: 5000, // Tiempo en milisegundos antes de redirigir (5 segundos)
  };

  // ============================================
  //  FUNCIONES DE UTILIDAD
  // ============================================
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: CONFIG.formatoMoneda,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  }

  function calculatePercentage(raised, goal) {
    return Math.min((raised / goal) * 100, 100);
  }

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // ============================================
  //  ✅ DETECCIÓN DE ESTADO DE PAGO
  // ============================================
  function checkPaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const amount = urlParams.get('amount');

    if (paymentStatus === 'success') {
      // ✅ PAGO EXITOSO: Mostrar agradecimiento y redirigir
      showThankYouMessage(amount);
      // Limpiar URL después de mostrar el mensaje
      cleanUrl();
    } else if (paymentStatus === 'cancel') {
      // ❌ PAGO CANCELADO: Redirigir inmediatamente
      console.log('Pago cancelado por el usuario');
      cleanUrl();
      // Opcional: mostrar mensaje de cancelación
      // alert('El pago fue cancelado. Puedes intentar de nuevo cuando quieras.');
    }
  }

  // ✅ LIMPIAR URL (eliminar parámetros ?payment=...)
  function cleanUrl() {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  // ✅ MOSTRAR MENSAJE DE AGRADECIMIENTO
  function showThankYouMessage(amount) {
    // Crear overlay de agradecimiento
    const overlay = document.createElement('div');
    overlay.className = 'thankyou-overlay';
    overlay.innerHTML = `
      <div class="confetti-container" id="confettiContainer"></div>
      <div class="thankyou-content">
        <div class="thankyou-icon-wrapper">
          <span class="thankyou-icon">✅</span>
        </div>
        <h1 class="thankyou-title">¡Gracias por tu generosidad!</h1>
        <p class="thankyou-message">
          Tu donación ha sido procesada exitosamente. Tu apoyo hace la diferencia.
        </p>
        <div class="thankyou-amount-box">
          <div class="thankyou-amount-label">Monto donado</div>
          <div class="thankyou-amount">$${amount || '0.00'}</div>
        </div>
        <div class="thankyou-redirect">
          Serás redirigido automáticamente en <span class="thankyou-countdown" id="countdown">${CONFIG.redirectDelay / 1000}</span> segundos
        </div>
        <div class="thankyou-progress-bar">
          <div class="thankyou-progress-fill"></div>
        </div>
        <button class="thankyou-button" onclick="redirectNow()">
          Volver ahora
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Activar animación
    setTimeout(() => {
      overlay.classList.add('active');
      createConfetti();
      startCountdown();
    }, 100);
  }

  // ✅ CREAR CONFETI
  function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const colors = ['#02a95c', '#fbbf24', '#ef4444', '#3b82f6', '#a855f7', '#ec4899'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
      container.appendChild(confetti);
    }
  }

  // ✅ CONTADOR REGRESIVO
  function startCountdown() {
    let seconds = CONFIG.redirectDelay / 1000;
    const countdownEl = document.getElementById('countdown');
    
    const interval = setInterval(() => {
      seconds--;
      if (countdownEl) {
        countdownEl.textContent = seconds;
      }
      
      if (seconds <= 0) {
        clearInterval(interval);
        redirectNow();
      }
    }, 1000);
  }

  // ✅ REDIRIGIR AHORA
  window.redirectNow = function() {
    window.location.href = CONFIG.redirectUrl;
  };

  // ============================================
  //  ANIMACIONES
  // ============================================
  function animateCounter(elementId, start, end, duration, isCurrency) {
    const element = document.getElementById(elementId);
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      element.textContent = isCurrency ? formatCurrency(current) : formatNumber(current);

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function animateWidget() {
    const percentage = calculatePercentage(CONFIG.recaudado, CONFIG.objetivo);
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (percentage / 100) * circumference;

    const progressRing = document.getElementById('progressRing');
    progressRing.style.strokeDasharray = circumference;
    progressRing.style.strokeDashoffset = circumference;

    progressRing.offsetHeight;

    requestAnimationFrame(() => {
      progressRing.style.transition = `stroke-dashoffset ${CONFIG.duracionAnimacion}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      progressRing.style.strokeDashoffset = offset;
    });

    animateCounter('percentValue', 0, Math.round(percentage), CONFIG.duracionAnimacion, false);
    animateCounter('raisedValue', 0, CONFIG.recaudado, CONFIG.duracionAnimacion, true);
    document.getElementById('goalValue').textContent = formatCurrency(CONFIG.objetivo);
    animateCounter('donorCount', 0, CONFIG.donantes, CONFIG.duracionAnimacion, false);
    document.getElementById('donorName').textContent = CONFIG.nombreDonante;
  }

  // ============================================
  //  FUNCIONES DEL MODAL
  // ============================================
  function renderDonorsList() {
    const list = document.getElementById('donorsList');
    const totalDonorsElement = document.getElementById('totalDonorsModal');
    
    list.innerHTML = '';
    
    DONANTES.forEach((donor, index) => {
      const li = document.createElement('li');
      li.className = 'donor-item';
      li.style.animationDelay = `${index * 0.05}s`;
      li.setAttribute('role', 'listitem');
      
      const messageHtml = donor.mensaje 
        ? `<span class="donor-message">"${donor.mensaje}"</span>` 
        : '';
      
      li.innerHTML = `
        <div class="donor-info">
          <div class="donor-avatar" aria-hidden="true">${getInitials(donor.nombre)}</div>
          <div class="donor-details">
            <span class="donor-name">${donor.nombre}</span>
            ${messageHtml}
          </div>
        </div>
        <span class="donor-amount">${formatCurrency(donor.monto)}</span>
      `;
      
      list.appendChild(li);
    });
    
    totalDonorsElement.textContent = CONFIG.donantes;
  }

  window.openDonorsModal = function() {
    renderDonorsList();
    const modal = document.getElementById('donorsModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      modal.querySelector('.modal-close').focus();
    }, 100);
  };

  window.closeDonorsModal = function() {
    const modal = document.getElementById('donorsModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.closeModalOnOverlay = function(event) {
    if (event.target === event.currentTarget) {
      closeDonorsModal();
    }
  };

  function handleKeyPress(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDonorsModal();
    }
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const modal = document.getElementById('donorsModal');
      if (modal.classList.contains('active')) {
        closeDonorsModal();
      }
    }
  });

  // ============================================
  //  BOTONES
  // ============================================
  window.handleDonate = function() {
    // ✅ AQUÍ DEBES INTEGRAR TU PASARELA DE PAGOS
    // Ejemplo con Stripe:
    /*
    fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 100 })
    })
    .then(response => response.json())
    .then(data => {
      window.location.href = data.url;
    });
    */
    
    alert('🎉 ¡Gracias por tu interés en donar!\n\nIntegra aquí tu pasarela de pagos.');
  };

  window.handleShare = function() {
    const shareData = {
      title: '¡Ayuda a alcanzar la meta!',
      text: `Se han recaudado ${formatCurrency(CONFIG.recaudado)} de ${formatCurrency(CONFIG.objetivo)}. ¡Dona ahora!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('🔗 ¡Enlace copiado al portapapeles!');
      });
    }
  };

  // ============================================
  //  API PÚBLICA
  // ============================================
  window.updateWidget = function(newConfig) {
    Object.assign(CONFIG, newConfig);
    animateWidget();
  };

  window.simulateDonation = function(amount, donorName) {
    CONFIG.recaudado += amount;
    CONFIG.donantes += 1;
    
    DONANTES.unshift({
      nombre: donorName || "Nuevo Donante",
      monto: amount,
      mensaje: "¡Gracias por apoyar!"
    });
    
    if (DONANTES.length > 10) {
      DONANTES.pop();
    }
    
    animateWidget();
  };

  window.updateDonorsList = function(newDonors) {
    DONANTES.length = 0;
    DONANTES.push(...newDonors);
  };

  // ============================================
  //  ✅ INICIALIZACIÓN CON DETECCIÓN DE PAGO
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    // ✅ PRIMERO: Verificar si viene de un pago
    checkPaymentStatus();
    
    // Luego: Animar el widget normalmente
    setTimeout(animateWidget, 300);
  });

})();
