# Group 1-11 INTEX Project Fall 2023: Provo City's Study on Social Media and its Impacts on Mental Health
## Authors: Alex Fankhauser, Preston Fitzgerald, Seth Brock, Zach Hansen

INTEX is short for "Integrated Exercise" and is an opportunity to practice what we have learned in IS 402, IS 403, IS 404, and IS 415 throughout the semester. A breakdown of the classes are as follows:

- IS 402: relational database principles using SQL and database normalizations. Tools used include PostgreSQL, pgAdmin, and AWS RDS.
- IS 403: HTML/JavaScript principles with Node.js Express frameworks. Tools used include Visual Studio Code, GitHub, and GitHub with AWS CodePipeline.
- IS 404: principles of data communication using API requests, DNS records, hosting, and command line interfacing. Tools used include Certbot and AWS Elastic Beanstalk.
- IS 415: exploratory data analysis with data storytelling principles. Tools include Google Colab, Microsoft Powerpoint, and Tableau.

Total time for the project is estimated to be around 120 hours

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
