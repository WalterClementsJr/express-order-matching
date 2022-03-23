const actionBtn = document.getElementById('action');
let current = document.forms.order.elements.tradeOption;
let prev;

function listener() {
    prev = this;
    actionBtn.textContent = this.value === 'buy' ? 'Mua' : 'Bán';
}

actionBtn.textContent = current[0].checked ? 'Mua' : 'Bán';

for(let i = 0; i < current.length; i++) {
    current[i].addEventListener('click', listener);
}
