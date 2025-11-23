class Job:
    def __init__(self, title, experience_level, published_date, enterprise, platform, location, contract_type, salary, link, other_details, skills=None):
        self.title = title
        self.experience_level = experience_level
        self.published_date = published_date
        self.enterprise = enterprise
        self.platform = platform
        self.location = location
        self.contract_type = contract_type
        self.salary = salary
        self.link = link
        self.other_details = other_details
    
    def __repr__(self):
        return f"Job(title={self.title}, experience_level={self.experience_level}, published_date={self.published_date}, enterprise={self.enterprise}, platform={self.platform}, location={self.location}, contract_type={self.contract_type}, salary={self.salary}, link={self.link}, other_details={self.other_details})"
    
    def to_dict(self):
        return {
            "title": self.title,
            "experience_level": self.experience_level,
            "published_date": self.published_date,
            "enterprise": self.enterprise,
            "platform": self.platform,
            "location": self.location,
            "contract_type": self.contract_type,
            "salary": self.salary,
            "link": self.link,
            ""
            "other_details": self.other_details
        }
        