'use strict';

let expensesItems = document.querySelectorAll('.expenses-items');
let incomeItems = document.querySelectorAll('.income-items');

const btnStart = document.getElementById('start');
const btnReset = document.getElementById('cancel');
const btnIncomeAdd = document.getElementsByTagName('button')[0];
const btnExpensesAdd = document.getElementsByTagName('button')[1];
const depositCheck = document.querySelector('#deposit-check');
const additionalIncome = document.querySelectorAll('.additional_income-item');
const budgetMonthValue = document.getElementsByClassName(  'budget_month-value')[0];
const budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValue = document.getElementsByClassName(  'expenses_month-value')[0];
const additionalIncomeValue = document.getElementsByClassName(  'additional_income-value')[0];
const additionalExpensesValue = document.getElementsByClassName(  'additional_expenses-value')[0];
const incomePeriodValue = document.getElementsByClassName(  'income_period-value')[0];
const targetMonthValue = document.getElementsByClassName(  'target_month-value')[0];
const salaryAmount = document.querySelector('.salary-amount');
const incomeTitle = document.querySelector('.income-items .income-title');
const expensesTitle = document.querySelector('input.expenses-title');
const additionalExpenses = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('input.target-amount');
const periodSelect = document.querySelector('.period-select');
const periodAmount = document.querySelector('.period-amount');
const depositBank = document.querySelector('.deposit-bank');
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');

const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
const isString = (s) => isNaN(s);


class AppData {
constructor() {
  this.income = [];
  this.incomeMonth = 0;
  this.addIncome = [];
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.expensesMonth = 0;
}
  start() {
    this.budget = +salaryAmount.value;
    this.getExpenses();
    this.getIncome();
    this.getExpensesMonth();
    this.getAddExpenses();
    this.getAddIncome();
    this.getInfoDeposit();
    this.getBudget();
    this.showResult();
    this.disablInput(true);
    btnStart.style.display = "none";
    btnReset.style.display = "block";
  }
  reset() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((item) => item.value = '');
    btnStart.style.display = "block";
    btnReset.style.display = "none";
    periodAmount.textContent = "1";
    periodSelect.value = 1;
    btnIncomeAdd.style.display = "none";
    this.disablInput(false);
    this.disableBtn();
    this.income = [];
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    incomeItems = document.querySelectorAll('.income-items');
    expensesItems = document.querySelectorAll('.expenses-items');
    for (let i = 1; i < incomeItems.length; i++) {
      incomeItems[0].parentNode.removeChild(incomeItems[i]);
    }
  
    for (let i = 1; i < expensesItems.length; i++) {
      expensesItems[0].parentNode.removeChild(expensesItems[i]);
    }
    btnExpensesAdd.style.display = "block";
    btnIncomeAdd.style.display = "block";
    depositCheck.checked = false;
    this.depositHandler();
  }
  showResult() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();
    periodSelect.addEventListener('input', () => incomePeriodValue.value = this.calcSavedMoney());
  }
  addIncomeBlock() {
    const cloneIncomeItem = incomeItems[0].cloneNode(true);
    cloneIncomeItem.querySelectorAll('input').forEach((item) => item.value = '');
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, btnIncomeAdd);
    incomeItems = document.querySelectorAll('.income-items');
    if (incomeItems.length === 3) {
      btnIncomeAdd.style.display = "none";
    }
  }
  addExpensesBlock() {
    const cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.querySelectorAll('input').forEach((item) => item.value = '');
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, btnExpensesAdd);
    expensesItems = document.querySelectorAll('.expenses-items');
    if (expensesItems.length === 3) {
      btnExpensesAdd.style.display = "none";
    }
  }
  getExpenses() {
    expensesItems.forEach((item) => {
      const itemExpenses = item.querySelector('.expenses-title').value;
      const cashExpenses = item.querySelector('.expenses-amount').value;
      if (itemExpenses !== '' && cashExpenses !== '') {
        this.expenses[itemExpenses] = cashExpenses;
      }
    });
  }
  getIncome() {
    incomeItems.forEach((item) => {
      const itemIncome = item.querySelector('.income-title').value;
      const cashIncome = item.querySelector('.income-amount').value;
      if (itemIncome !== '' && cashIncome !== '') {
        this.income[itemIncome] = cashIncome;
      }
    });
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }
  getAddExpenses() {
    const addExpenses = additionalExpenses.value.split(', ');
    addExpenses.forEach((item) => {
      item = item.trim();
      if (item !== '') {
        this.addExpenses.push(item);
      }
    });
  }
  getAddIncome() {
    additionalIncome.forEach((item) => {
      const itemValue = item.value.trim();
      if (itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    });
  }
  getPeriod() {
    periodAmount.textContent = periodSelect.value;
  }
  getExpensesMonth() {
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
  }
  getBudget() {
    const MonthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + MonthDeposit;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  }
  getTargetMonth() {
    return Number(Math.ceil(targetAmount.value / this.budgetMonth));
  }
  getStatusIncome() {
    if (this.budgetDay >= 1200) {
      return 'У вас высокий уровень дохода';
    } else if (this.budgetDay >= 600) {
      return 'У вас средний уровень дохода';
    } else if (this.budgetDay >= 0) {
      return 'К сожалению у вас уровень дохода ниже среднего';
    } else {
      return 'Что то пошло не так';
    }
  }
  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  };
  disableBtn() {
    if (salaryAmount.value === '') {
      btnStart.disabled = true;
      btnStart.style.backgroundColor = "#d5d5d5";
    } else {
      btnStart.disabled = false;
      btnStart.style.backgroundColor = "";
    }
  };
  disablInput(bool) {
    const inputsText = document.querySelectorAll('.data [type="text"]');
    inputsText.forEach((item) => item.disabled = bool);
    btnIncomeAdd.disabled = bool;
    btnExpensesAdd.disabled = bool;
    depositCheck.disabled = bool;
  }
  checkPercent() {
    if (depositPercent.value >= 0 && depositPercent.value <= 100) {
      btnStart.disabled = false;
      btnStart.style.backgroundColor = "";
    } else {
      depositPercent.value = '';
      btnStart.disabled = true;
      btnStart.style.backgroundColor = "#d5d5d5";
      alert('Введите корректное значение в поле «Проценты»');
    }
  }
  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }
  changePercent() {
    const valueSelect = this.value;
    if (valueSelect === 'other') {
      depositPercent.value = '';
      depositPercent.style.display = 'inline-block';
    } else {
      depositPercent.value = valueSelect;
      depositPercent.style.display = 'none';
    }
  }
  depositHandler() {
    if (depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositPercent.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      depositPercent.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent);
    }
  }
  eventsListeners() {
  btnStart.disabled = true;
  btnStart.style.backgroundColor = "#d5d5d5"
  salaryAmount.addEventListener('input', this.disableBtn);
  btnStart.addEventListener('click', this.start.bind(this));
  btnReset.addEventListener('click', this.reset.bind(this));
  btnExpensesAdd.addEventListener('click', this.addExpensesBlock.bind(this));
  btnIncomeAdd.addEventListener('click', this.addIncomeBlock.bind(this));
  periodSelect.addEventListener('input', this.getPeriod);
  depositCheck.addEventListener('change', this.depositHandler.bind(this));
  depositPercent.addEventListener('input', this.checkPercent);
  }
};

const appData = new AppData();
appData.eventsListeners();