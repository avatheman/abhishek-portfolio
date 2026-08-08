// ============================================================
// Shared behaviour across all pages
// ============================================================

// --- mobile nav toggle ---
(function(){
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if(!toggle || !sidebar) return;
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    const open = sidebar.classList.contains('mobile-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  sidebar.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
  });
})();

// --- active nav link ---
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path){ a.classList.add('active'); }
  });
})();

// ============================================================
// Interactive 3-qubit bit-flip code demo (home page)
//
// States: "clean" -> "error" -> "corrected" -> back to "clean"
// q1 (middle data qubit) is flipped as the injected error.
// Ancilla a0 measures parity(q0,q1); a1 measures parity(q1,q2).
// A single bit-flip on q1 lights up BOTH ancillas (syndrome "11"),
// pinpointing q1 as the culprit — matching the standard 3-qubit
// bit-flip code syndrome table.
// ============================================================
(function(){
  const root = document.getElementById('circuit-demo');
  if(!root) return;

  const q0 = root.querySelector('#q0-state');
  const q1 = root.querySelector('#q1-state');
  const q2 = root.querySelector('#q2-state');
  const q0ket = root.querySelector('#q0-ket');
  const q1ket = root.querySelector('#q1-ket');
  const q2ket = root.querySelector('#q2-ket');

  const a0box = root.querySelector('#a0-box');
  const a1box = root.querySelector('#a1-box');
  const a0val = root.querySelector('#a0-val');
  const a1val = root.querySelector('#a1-val');

  const stateLabel = root.querySelector('.circuit-state-label');
  const btnError = root.querySelector('#btn-inject');
  const btnCorrect = root.querySelector('#btn-correct');
  const btnReset = root.querySelector('#btn-reset');

  let state = 'clean';

  function render(){
    [q0, q1, q2].forEach(el => el.classList.remove('is-error'));
    [q0ket, q1ket, q2ket].forEach(el => el.textContent = '|0⟩');
    [a0box, a1box].forEach(el => el.classList.remove('lit'));
    [a0val, a1val].forEach(el => { el.classList.remove('lit'); el.textContent = '0'; });

    if(state === 'clean'){
      stateLabel.textContent = 'state: |000⟩  (encoded)';
      stateLabel.dataset.state = 'clean';
      btnError.disabled = false;
      btnCorrect.disabled = true;
      btnReset.disabled = true;
    }
    if(state === 'error'){
      q1.classList.add('is-error', 'is-flash');
      q1ket.textContent = '|1⟩';
      a0box.classList.add('lit'); a0val.classList.add('lit'); a0val.textContent = '1';
      a1box.classList.add('lit'); a1val.classList.add('lit'); a1val.textContent = '1';
      stateLabel.textContent = 'syndrome 11 → error on q1';
      stateLabel.dataset.state = 'error';
      btnError.disabled = true;
      btnCorrect.disabled = false;
      btnReset.disabled = false;
    }
    if(state === 'corrected'){
      stateLabel.textContent = 'X correction applied → |000⟩';
      stateLabel.dataset.state = 'corrected';
      btnError.disabled = true;
      btnCorrect.disabled = true;
      btnReset.disabled = false;
    }
  }

  btnError.addEventListener('click', () => { state = 'error'; render(); });
  btnCorrect.addEventListener('click', () => { state = 'corrected'; render(); });
  btnReset.addEventListener('click', () => { state = 'clean'; render(); });

  render();
})();
