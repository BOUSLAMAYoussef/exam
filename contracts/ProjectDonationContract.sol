// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract ProjectDonationContract {
    struct Project {
        uint256 id;
        string title;
        string description;
        address payable owner; 
    }

    struct Donation {
        address donor;
        uint256 amount;
    }

    uint256 public projectIdCounter;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Donation[]) public projectDonations;

    constructor() {
        projectIdCounter = 1;
    }

    function createProject(string memory _title, string memory _description) public {
        projects[projectIdCounter] = Project({
            id: projectIdCounter,
            title: _title,
            description: _description,
            owner: payable(msg.sender)
        });
        projectIdCounter++;
    }

    function donateToProject(uint256 _projectId) public payable {
        Project storage project = projects[_projectId];
        require(project.id != 0, "Invalid project ID");

        Donation[] storage donations = projectDonations[_projectId];
        require(donations.length == 0, "Donation already made to this project");

        uint256 donationAmount = msg.value;
        donations.push(Donation({
            donor: msg.sender,
            amount: donationAmount
        }));

        project.owner.transfer(donationAmount);
    }

    function getDonorList(uint256 _projectId) public view returns (Donation[] memory) {
        return projectDonations[_projectId];
    }
}
