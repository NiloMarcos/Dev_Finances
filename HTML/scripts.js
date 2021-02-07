const Modal = {
    open(){
      // Abri Modal
      // Adicionar a class active ao modal
      document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },
    close(){
      // Fechar o modal
      // Remover a class active do modal
      document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
  }

const Storage = {
    get() {
      return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||
      []
    },
  
    set(transactions) {
      localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
  }

const Transaction = {
      all: Storage.get(),

      add(transaction){
          Transaction.all.push(transaction)

          App.reload()
      },

      remove(index){
          Transaction.all.splice(index, 1)

          App.reload()
      },

      incomes() {
        let income = 0;
        // Pegar todas as transacoes
        // Para cada transacao
        Transaction.all.forEach(transaction => {
          // Se ela for maior que zero
          if( transaction.amount > 0 ) {
            // Somar a uma variavel e retornar a variavel
            income += transaction.amount;
          }
        })
          return income;
      },

      expenses() {
        let expense = 0;
        // Pegar todas as Transaçoes
        // Para cada transacao
        Transaction.all.forEach(transaction => {
          // Se ela for menor que zero
          if( transaction.amount < 0) {
            // Somar a uma variavel e retornar a variavel
            expense += transaction.amount;
          }
        })
          return expense;
      },

      total() {
          return Transaction.incomes() + Transaction.expenses();
      }
  }

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
      const tr = document.createElement('tr')
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
      tr.dataset.index - index

      DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "Income" : "expense"

        const amount = Utils.formatCurrecy(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
              <td class="${CSSclass}">${amount}</td>
              <td class="date">${transaction.date}</td>
              <td>
              <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"/>
            </td>
        `
      return html

    },
    
    updateBalance() {
      document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrecy(Transaction.incomes())
      document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrecy(Transaction.expenses())
      document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrecy(Transaction.total())
    },

    clearTransactions() {
      DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
  formatAmount(value) {
    value = Number(value) * 100
    
    return value
  },

  formatDate(date){
    const splittedDate = date.split("-")
    
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrecy(value) {
    const signal = Number(value) < 0 ? "-" : ""

    
    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value
  }
}

const Form = {
  description: document.querySelector('Input#description'),
  amount: document.querySelector('Input#amount'),
  date: document.querySelector('Input#date'),

  getValues() {
    return{
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },
  validadeField() {
    const {description, amount, date} = Form.getValues()
    
    if( description.trim() === "" ||
        amount.trim() === "" ||
        date.trim() === "" ) {
            throw new Error("Por Favor, preencha todos os campos")
        }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()
    
    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  saveTransaction( transaction ) {
    Transaction.add(transaction)
  },

  clearField() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
      event.preventDefault()


      try {
        // Verificiar se todas as informacoes forem preenchidas
        Form.validadeField()
        // formatar os dados para salvar
        const transaction = Form.formatValues()
        // salvar
        Form.saveTransaction(transaction)
        // apagar os dados do formularios
        Form.clearField()
        // modal feche
        Modal.close()
      } catch (error) {
          alert(error.message)
      }


      
  }
}


const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction)

    DOM.updateBalance()

    Storage.set(Transaction.all)

  },
  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()
