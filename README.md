# Group 1-11 INTEX Project Fall 2023: Provo City's Study on Social Media and its Impacts on Mental Health
### Authors and Acknowledgement: 
Alex Fankhauser, Preston Fitzgerald, Seth Brock, and Zach Hansen were the group members involved in making the project. We also give thanks to our professors for inspiring us every day, and for the beautiful Provo City website that inspired the design of this website.

### Introduction
INTEX is short for "Integrated Exercise" and is an opportunity to practice what we have learned in IS 402, IS 403, IS 404, and IS 415 throughout the semester. A breakdown of the classes are as follows:

- IS 402: relational database principles using SQL and database normalizations. Tools used include PostgreSQL, pgAdmin, and AWS RDS.
- IS 403: HTML/JavaScript principles with Node.js Express frameworks. Tools used include Visual Studio Code, GitHub, and GitHub with AWS CodePipeline.
- IS 404: principles of data communication using API requests, DNS records, hosting, and command line interfacing. Tools used include Certbot and AWS Elastic Beanstalk.
- IS 415: exploratory data analysis with data storytelling principles. Tools include Google Colab, Microsoft Powerpoint, and Tableau.

Total time for the project is estimated to be around 150 hours between the four people over the course of a week.

### Project Background
**--Note that this is a fictional scenario, Provo was not consulted in this and Plainsville is a fake place.**

Amidst the ever-expanding role of social media in daily life, Provo’s city government recognizes a pressing need to explore the intricate relationship between digital connectivity and mental health within their community. With a surge in concerns regarding rising levels of anxiety, depression, and social isolation, Provo’s local government has created a Social Media Usage and Mental Health committee (SMU MH committee) to investigate how social media usage patterns may contribute to these challenges. By delving into this connection, they seek a nuanced understanding of the specific influences and stressors that digital platforms may exert on residents' mental well-being.

The SMU MH committee has acquired a dataset about social media usage and mental health from a nearby community called Plainsville with similar demographics. We were contracted by the SMU MH committee and were asked to do three things:

1. Investigate the dataset and present insights and recommendations.
2. Create a website that gathers information from Provo citizens about their social media usage and mental health.
3. Create a dashboard to investigate the high-level relationship between social media usage and mental health.

The files that this README is written for are in relation to the second and third points and the website made to address them. The website was hosted at mentalhealthprovo.is404.net, though was left up only long enough to be graded and then taken down.

### Project Description
The website for this project has many funcitonalities, including:
- A home page describing the purpose of the website and of SMU MH
- A survey page for anyone to answer questions related to social media use and mental health, which then checks inputs before submitting them to a centralized relational database hosted through AWS. This page does not take note of any identifying information, so the data is anonymous.
- A data page which allows anyone to view a customized and interactive Tableau dashboard to see the results and conclusions drawn by the survey and by our own exploratory analysis.
- Another data page specifically for admin-level users to see the same Tableau dashboard, and also the individual survey responses.
- Login functionality, which connects to a database to store usernames and passwords for admin-level users. Account creation is only possible while already logged in to an admin account, and page routing/redirecting protects certain views to uphold website integrity.

### Usage
This website is intended to be used by Provo citizens and Provo City/SMU MH officials to learn more about Social Media's effects on mental health. The website is set up in a simple way to show only pertinent information and make navigation intuitive. Starting at the homepage, a user can simply click the menu item labeled "Survey" to contribute to the survey responses and refine the legitimacy of data trends and insights collected. Another click to the "Data" menu item will take the user to a Tableau dashboard with live insights into the data collected designed to make the data engaging and easily-interpreted. Admin-level users can view individual survey responses from the same menu item. The last possible menu option "Login" allows admin-level users to use their credentials to login to access the data. After logging in the menu item is changed to "Account" where they can edit their account info, create a new account for other users, and delete their account.

For investigation into the full capabilities of the website (this is for you TA's), the following URL, username, and password can be used. After the completion of grading, the login information will be deleted for data protection.

- URL: https://mentalhealthprovo.is404.net/
- Username: admin
- Password: badmin

### Installation
Code from GitHub is directly injected into an AWS Beanstalk application using AWS CodePipeline. Before this was set up, a simple way to get the code uploaded to the side was by compressing all the files in the folder (except "node_modules" which is provided by AWS) and uploading them as a new version.

### Roadmap
This is planned to be the last release of this website.

### Contributing
We do not accept outside contributors to the project, though if you like this basic website framework we welcome anyone who wants to make their own branch. To make this code your own you will want to change the code related to the database, as well as the Certbot configurations. The files to start with there would be "index.js" and ".platform/hooks/postdeploy/00_get_certificate.sh". Comments throughout the code documenting functionality and authorship may also want to be adjusted.

### Support
Support requests can be made over email to smumh@byu.net or over phone to (801) 378-1557. The same contact information is displayed in the footers for every page on the website.

### Project Status: Completed
