const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reducedMotion) {
  document.documentElement.classList.add('has-scroll-reveal');

  const revealSections = document.querySelectorAll('main > section');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold:0.16,
    rootMargin:'0px 0px -10% 0px'
  });

  revealSections.forEach((section, index) => {
    section.classList.add('scroll-reveal');
    if (index === 0) section.classList.add('is-visible');
    else revealObserver.observe(section);

    section.addEventListener('focusin', () => {
      section.classList.add('is-visible');
      revealObserver.unobserve(section);
    }, { once:true });
  });
}

const $ = id => document.getElementById(id);
const fmt = number => '$' + Math.round(number).toLocaleString();

function activateTab(component, target) {
  component.querySelectorAll('[data-tab-target]').forEach(trigger => {
    const active = trigger.dataset.tabTarget === target;
    trigger.classList.toggle('is-active', active);
    trigger.setAttribute('aria-selected', String(active));
  });

  component.querySelectorAll('[data-tab-panel]').forEach(panel => {
    panel.classList.toggle('is-active', panel.dataset.tabPanel === target);
  });
}

document.querySelectorAll('[data-interaction="tabs"]').forEach(component => {
  const hover = component.dataset.activateOn === 'hover';

  component.querySelectorAll('[data-tab-target]').forEach(trigger => {
    const activate = () => activateTab(component, trigger.dataset.tabTarget);
    if (trigger.tagName !== 'BUTTON') trigger.setAttribute('role', 'button');
    trigger.addEventListener('click', activate);
    trigger.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
    if (hover) {
      trigger.addEventListener('mouseenter', activate);
      trigger.addEventListener('focus', activate);
    }
  });
});

document.querySelectorAll('[data-interaction="accordion"]').forEach(component => {
  component.querySelectorAll('.faq-item').forEach(item => {
    const button = item.querySelector('button');
    const indicator = button.querySelector('b');

    button.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-active');

      component.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('is-active');
        other.querySelector('button').setAttribute('aria-expanded', 'false');
        other.querySelector('button b').textContent = '+';
      });

      item.classList.toggle('is-active', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
      indicator.textContent = willOpen ? '−' : '+';
    });
  });
});

document.querySelectorAll('[data-interaction="exclusive-disclosure"]').forEach(component => {
  component.querySelectorAll('[data-disclosure-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      component.querySelectorAll('[data-disclosure-trigger]').forEach(other => {
        const active = other === trigger;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-expanded', String(active));
      });
    });
  });
});

const assessment = document.querySelector('[data-assessment]');
const assessmentCard = assessment.querySelector('.assessment-card');
const assessmentSteps = assessment.querySelectorAll('[data-assessment-step]');
const assessmentResults = assessment.querySelectorAll('[data-assessment-result]');
const assessmentProgressBar = assessment.querySelector('.progress');
const assessmentProgress = assessment.querySelectorAll('.progress span');
let assessmentStep = 0;
let assessmentAnswers = {};

function recommendationKey() {
  if (assessmentAnswers.priority === 'assets' || assessmentAnswers.fleet === 'construction') return 'assets';
  if (assessmentAnswers.priority === 'compliance' || assessmentAnswers.fleet === 'transport') return 'compliance';
  if (assessmentAnswers.priority === 'safety' || ['road', 'dual', 'multi'].includes(assessmentAnswers.video)) return 'safety';
  return 'visibility';
}

function renderAssessmentState() {
  const complete = assessmentStep >= assessmentSteps.length;
  assessmentCard.classList.toggle('is-complete', complete);
  assessmentProgressBar.setAttribute('aria-valuenow', String(Math.min(assessmentStep + 1, assessmentSteps.length)));

  assessmentSteps.forEach((panel, index) => {
    panel.classList.toggle('is-active', !complete && index === assessmentStep);
  });

  assessmentResults.forEach(panel => {
    panel.classList.toggle('is-active', complete && panel.dataset.assessmentResult === recommendationKey());
  });

  assessmentProgress.forEach((item, index) => {
    item.classList.toggle('done', complete || index < assessmentStep);
    item.classList.toggle('active', !complete && index === assessmentStep);
  });
}

assessment.querySelectorAll('[data-answer]').forEach(button => {
  button.addEventListener('click', () => {
    assessmentAnswers[button.dataset.answer] = button.dataset.value;
    assessmentStep += 1;
    renderAssessmentState();
  });
});

assessment.querySelectorAll('.assessment-back').forEach(button => {
  button.addEventListener('click', () => {
    assessmentStep = Math.max(0, assessmentStep - 1);
    renderAssessmentState();
  });
});

assessment.querySelectorAll('.assessment-restart').forEach(button => {
  button.addEventListener('click', () => {
    assessmentStep = 0;
    assessmentAnswers = {};
    renderAssessmentState();
  });
});

function calculateSavings() {
  const vehicles = +$('v').value || 0;
  const miles = +$('m').value || 0;
  const fuelCost = +$('f').value || 0;
  const mpg = +$('g').value || 1;
  const accidents = +$('a').value || 0;
  const currentMonthlyCost = +$('c').value || 0;
  const fuel = (vehicles * miles / mpg) * fuelCost * .3;
  const accident = accidents * 26081 * .6;
  const operations = vehicles * 3000 * .15;
  const investment = vehicles * 34.99 * 12;
  const net = fuel + accident + operations + (vehicles * currentMonthlyCost * 12) - investment;

  $('fuel').textContent = fmt(fuel);
  $('accident').textContent = fmt(accident);
  $('ops').textContent = fmt(operations);
  $('investment').textContent = '−' + fmt(investment);
  $('net').textContent = fmt(net);
}

['v', 'm', 'f', 'g', 'a', 'c'].forEach(id => $(id).addEventListener('input', calculateSavings));
calculateSavings();
renderAssessmentState();
