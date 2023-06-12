// JavaScript code for interacting with the smart contract

// Connect to the Ethereum network using web3.js
// Make sure to include web3.js library in your HTML file

// Set the contract address and ABI
const contractAddress = '0x4E2438C08B70c1e1980BdA9933eDEDa7177FD0CD'; // Replace with your actual contract address
const contractABI =  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "projectDonations",
      "outputs": [
        {
          "internalType": "address",
          "name": "donor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "projectIdCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "projects",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "address payable",
          "name": "owner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "createProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "donateToProject",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "getDonorList",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "donor",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct ProjectDonationContract.Donation[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]

// Create a web3 instance
const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545'); // Replace with your actual provider
// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    // Request access to the user's accounts
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
            // Update the accountAddress element with the current account address
            document.getElementById('accountAddress').textContent = accounts[0];
        })
        .catch((error) => {
            // Handle error
            console.error(error);
        });
} else {
    // MetaMask is not installed, display an error or prompt the user to install it
    console.error('MetaMask is not installed');
}

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to create a new project
async function createProject() {
  // Get the project title and description from the input fields
  const title = document.getElementById('projectTitleInput').value;
  const description = document.getElementById('projectDescriptionInput').value;

  // Call the createProject function in the smart contract
  try {
    const accounts = await web3.eth.requestAccounts();
    const sender = accounts[0];

    const result = await contract.methods.createProject(title, description).send({ from: sender });

    // Project creation successful, update the UI or show a success message
    console.log('Project created successfully:', result);
  } catch (error) {
    // Error occurred during project creation, handle the error or show an error message
    console.error('Error creating project:', error);
  }
}

// Function to donate to a project
async function donateToProject(projectId) {
    // Get the donation amount from the user
    const donationAmount = parseFloat(prompt('Enter the amount to donate (ETH)'));
  
    // Convert the donation amount to wei (1 ETH = 10^18 wei)
    const donationAmountWei = web3.utils.toWei(donationAmount.toString(), 'ether');
  
    // Call the donateToProject function in the smart contract
    try {
      const accounts = await web3.eth.requestAccounts();
      const sender = accounts[0];
  
      const result = await contract.methods.donateToProject(projectId).send({ from: sender, value: donationAmountWei });
  
      // Donation successful, update the UI or show a success message
      console.log('Donation successful:', result);
    } catch (error) {
      // Error occurred during donation, handle the error or show an error message
      console.error('Error donating:', error);
    }
  }
  
// Function to retrieve project details
async function getProjectDetails(projectId) {
  // Call the projects mapping in the smart contract to retrieve project details
  try {
    const project = await contract.methods.projects(projectId).call();

    // Project details retrieved successfully, update the UI or display the details
    console.log('Project details:', project);
  } catch (error) {
    // Error occurred while retrieving project details, handle the error or show an error message
    console.error('Error getting project details:', error);
  }
}

// Function to retrieve project donations
async function getProjectDonations(projectId) {
  // Call the projectDonations mapping in the smart contract to retrieve donations for a project
  try {
    const donations = await contract.methods.projectDonations(projectId).call();

    // Donations retrieved successfully, update the UI or display the donations
    console.log('Donations:', donations);
  } catch (error) {
    // Error occurred while retrieving donations, handle the error or show an error message
    console.error('Error getting donations:', error);
  }
}
async function showDonorList(projectId) {
    // Call the smart contract function to get the list of donors for the given project ID
    const donorList = await contract.methods.getDonorList(projectId).call();
  
    // Get the donorList element from the HTML
    const donorListElement = document.getElementById('donorList');
  
    // Clear the existing donor list
    donorListElement.innerHTML = '';
  
    // Iterate over the donorList array and create list items for each donor
    donorList.forEach((donation, index) => {
      // Create a new list item element
      const listItem = document.createElement('li');
  
      // Set the text content of the list item to display the donor information
      listItem.textContent = `${index + 1}. ${donation.donor}: ${donation.amount} ETH`;
  
      // Append the list item to the donorList element
      donorListElement.appendChild(listItem);
    });
  }
  
  
