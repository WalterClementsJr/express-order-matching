const tradeOption = document.getElementById('tradeOption');
const actionBtn = document.getElementById('action');
const checkMultiplier = document.getElementById('enableMultiplier');

actionBtn.innerText = tradeOption.value === 'buy' ? 'Mua' : 'Bán';

tradeOption.addEventListener('change', function () {
    actionBtn.innerText = this.value === 'buy' ? 'Mua' : 'Bán';
});
checkMultiplier.addEventListener('change', function () {
    document.getElementById('multiplier').disabled = !this.checked
});
