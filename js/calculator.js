// ==========================================
// VEXOR HUB - Real Estate 3D ROI & Lead Simulator
// Real-time calculation engine for real estate traffic performance
// ==========================================

const WHATSAPP_PHONE = '554792224498'; // +55 47 9222-4498

class RealEstateCalculator {
  constructor() {
    this.budgetSlider = document.getElementById('calc-budget');
    this.ticketSlider = document.getElementById('calc-ticket');
    this.closeRateSlider = document.getElementById('calc-conversion');

    this.budgetValue = document.getElementById('calc-budget-val');
    this.ticketValue = document.getElementById('calc-ticket-val');
    this.closeRateValue = document.getElementById('calc-conversion-val');

    // Outputs
    this.leadsOut = document.getElementById('res-leads');
    this.visitsOut = document.getElementById('res-visits');
    this.salesOut = document.getElementById('res-sales');
    this.vgvOut = document.getElementById('res-vgv');
    this.revenueOut = document.getElementById('res-revenue');
    this.roiOut = document.getElementById('res-roi');
    this.calcCta = document.getElementById('calc-whatsapp-cta');

    if (!this.budgetSlider || !this.ticketSlider) return;

    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    const inputs = [this.budgetSlider, this.ticketSlider, this.closeRateSlider];
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.calculate();
          this.triggerPulsingEffect();
        });
      }
    });

    // Preset buttons (ex: Econômico, Médio Padrão, Alto Luxo)
    const presetBtns = document.querySelectorAll('.tier-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const budget = btn.dataset.budget;
        const ticket = btn.dataset.ticket;
        if (budget && this.budgetSlider) this.budgetSlider.value = budget;
        if (ticket && this.ticketSlider) this.ticketSlider.value = ticket;
        this.calculate();
        this.triggerPulsingEffect();
      });
    });
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(Math.round(value));
  }

  calculate() {
    const budget = parseFloat(this.budgetSlider.value);
    const ticket = parseFloat(this.ticketSlider.value);
    const closeRate = parseFloat(this.closeRateSlider.value) / 100;

    // Display formatted inputs
    if (this.budgetValue) this.budgetValue.textContent = this.formatCurrency(budget);
    if (this.ticketValue) this.ticketValue.textContent = this.formatCurrency(ticket);
    if (this.closeRateValue) this.closeRateValue.textContent = (closeRate * 100).toFixed(1) + '%';

    // Real Estate Cost Per Lead logic depending on ticket size
    // Higher ticket = slightly higher CPL, but massive VGV return
    let cpl = 16.0; // Base CPL
    if (ticket > 1000000) {
      cpl = 28.0; // Alto Padrão
    } else if (ticket > 500000) {
      cpl = 20.0; // Médio Padrão
    } else {
      cpl = 14.0; // Econômico / MCMV
    }

    const estimatedLeads = Math.max(1, Math.round(budget / cpl));
    // Agendamentos e visitas qualificadas (aprox. 18% dos leads)
    const estimatedVisits = Math.max(1, Math.round(estimatedLeads * 0.18));
    // Vendas estimadas
    const estimatedSales = Math.max(1, Math.round(estimatedLeads * closeRate));
    // VGV Potencial
    const potentialVGV = estimatedSales * ticket;
    // Comissão Imobiliária Média (5% a 6%)
    const commissionRate = 0.055;
    const estimatedCommission = potentialVGV * commissionRate;
    // ROI Multiplicador
    const roiMultiplier = (estimatedCommission / budget).toFixed(1);

    // Update UI with smooth animation
    this.animateValue(this.leadsOut, estimatedLeads, '');
    this.animateValue(this.visitsOut, estimatedVisits, '');
    this.animateValue(this.salesOut, estimatedSales, ' imóveis');
    if (this.vgvOut) this.vgvOut.textContent = this.formatCurrency(potentialVGV);
    if (this.revenueOut) this.revenueOut.textContent = this.formatCurrency(estimatedCommission);
    if (this.roiOut) this.roiOut.textContent = `${roiMultiplier}x ROI`;

    // Dynamic WhatsApp CTA text
    if (this.calcCta) {
      const msg = encodeURIComponent(
        `Olá equipe Vexor Hub! Fiz uma simulação no site com orçamento de ${this.formatCurrency(budget)}/mês para imóveis de ${this.formatCurrency(ticket)} (Projeção de ${estimatedLeads} leads e VGV de ${this.formatCurrency(potentialVGV)}). Gostaria de agendar uma consultoria estratégica para minha imobiliária!`
      );
      this.calcCta.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
    }
  }

  animateValue(element, target, suffix = '') {
    if (!element) return;
    element.textContent = this.formatNumber(target) + suffix;
  }

  triggerPulsingEffect() {
    const card = document.querySelector('.calculator-results-card');
    if (card) {
      card.classList.add('calc-pulse');
      setTimeout(() => card.classList.remove('calc-pulse'), 400);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.vexorCalc = new RealEstateCalculator();
});
