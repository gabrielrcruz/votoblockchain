
const contractAddress = '0x61ac85Fd0619Cec47c869732895b0d0173EEcAB6';

const configs = {
  abi: [
    {
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "names",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "candidate",
          "type": "bytes32"
        }
      ],
      "name": "insertVote",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "candidate",
          "type": "bytes32"
        }
      ],
      "name": "isValid",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "totalVotes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "candidate",
          "type": "bytes32"
        }
      ],
      "name": "totalVotesFor",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  contractAddress
}

class SetAndGetInfosLocalStorage {
  setItem(key, value) {
    localStorage.setItem(key, value);
  }
  getItem(key) {
    return localStorage.getItem(key);
  }
  clearAll() {
    localStorage.clear();
  }
}


const setAndGetInfosLocalStorage = new SetAndGetInfosLocalStorage;

let contract;

export const login = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      console.log('Web3 enabled!');
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }

  setAndGetInfosLocalStorage.clearAll();
  setAndGetInfosLocalStorage.setItem('userAddress', window.ethereum.selectedAddress);

  contract = new web3.eth.Contract(configs.abi, configs.contractAddress);
}

//   //Array de candidatos
  const candidates = {"Cassiano": "candidate-1", "Carlos": "candidate-2", "Joao": "candidate-3"}

//   //Função para inserir voto de um candidato
  export const insertVote = async (candidate) => {
    console.log(candidate);
    const userAddress = setAndGetInfosLocalStorage.getItem('userAddress');
    const candidateNames = Object.keys(candidates)

    // convert the candidate name to a bytes32
    const candidateBytes32 = web3.utils.utf8ToHex(candidate);

    for (let i = 0; i < candidateNames.length; i++) {
      if (candidate !== candidateNames[i]) {
        await contract.methods.insertVote(candidateBytes32).send({
          from: userAddress
        });
      } else {
        alert('Voto não computado. Candidato não existe.');
      }
    }

  }

  //Função para recuperar lista de candidatos com a contagem de votos
  export const getListCandidates = async () => {
    const candidateNames = Object.keys(candidates);

    for(var i=0; i<candidateNames.length; i++) {

      let name = candidateNames[i];
      const votes = await contract.methods.totalVotesFor(web3.utils.asciiToHex(name)).call()
      $('#'+candidates[name]).text(votes);
    }

};