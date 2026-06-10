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
  //  INICIALIZACIÓN
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateWidget, 300);
  });

})();

