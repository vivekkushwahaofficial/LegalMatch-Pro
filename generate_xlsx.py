import openpyxl
import os

# --- NGO Data ---
ngo_wb = openpyxl.Workbook()
ngo_ws = ngo_wb.active
ngo_ws.title = "NGO Data"
ngo_ws.append(["org_name", "city", "focus_area", "registration_status"])

ngo_data = [
    ["Legal Aid Foundation", "Mumbai", "Family Law", "Registered"],
    ["Justice For All", "Delhi", "Criminal Law", "Registered"],
    ["Women's Rights Initiative", "Bangalore", "Women's Rights", "Registered"],
    ["Human Rights Watch India", "Chennai", "Human Rights", "Registered"],
    ["Child Protection Society", "Pune", "Child Welfare", "Registered"],
    ["Rural Legal Aid Network", "Nanded", "Property Law", "Registered"],
    ["Anti-Corruption Movement", "Hyderabad", "Anti-Corruption", "Registered"],
    ["Consumer Rights Forum", "Kolkata", "Consumer Protection", "Registered"],
    ["Environmental Justice Trust", "Jaipur", "Environmental Law", "Registered"],
    ["Digital Rights Foundation", "Ahmedabad", "Cyber Law", "Registered"],
    ["Disability Rights Alliance", "Lucknow", "Disability Rights", "Registered"],
    ["Labor Rights Council", "Nagpur", "Labor Law", "Registered"],
    ["Senior Citizens Legal Aid", "Bhopal", "Elder Law", "Registered"],
    ["Tribal Justice Network", "Ranchi", "Tribal Rights", "Registered"],
    ["Refugee Assistance Program", "Guwahati", "Immigration Law", "Registered"],
]

for row in ngo_data:
    ngo_ws.append(row)

output = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend", "src", "main", "resources", "ngo_data.xlsx")
ngo_wb.save(output)
print(f"Created: {output}")

# --- Lawyer Data ---
lawyer_wb = openpyxl.Workbook()
lawyer_ws = lawyer_wb.active
lawyer_ws.title = "Lawyer Data"
lawyer_ws.append(["name", "city", "practiceArea", "verificationStatus"])

lawyer_data = [
    ["Adv. Rajesh Sharma", "Mumbai", "Family Law", "Verified"],
    ["Adv. Priya Mehta", "Delhi", "Criminal Law", "Verified"],
    ["Adv. Suresh Patel", "Bangalore", "Property Law", "Verified"],
    ["Adv. Ananya Iyer", "Chennai", "Corporate Law", "Verified"],
    ["Adv. Vikram Singh", "Pune", "Civil Law", "Verified"],
    ["Adv. Neha Deshmukh", "Nanded", "Family Law", "Verified"],
    ["Adv. Arjun Kapoor", "Hyderabad", "Criminal Law", "Verified"],
    ["Adv. Kavita Roy", "Kolkata", "Consumer Protection", "Verified"],
    ["Adv. Manish Gupta", "Jaipur", "Tax Law", "Verified"],
    ["Adv. Deepa Reddy", "Ahmedabad", "Cyber Law", "Verified"],
    ["Adv. Sanjay Kumar", "Lucknow", "Labor Law", "Verified"],
    ["Adv. Meera Nair", "Nagpur", "Environmental Law", "Verified"],
    ["Adv. Rahul Joshi", "Bhopal", "Constitutional Law", "Verified"],
    ["Adv. Sunita Devi", "Ranchi", "Human Rights", "Verified"],
    ["Adv. Amit Verma", "Guwahati", "Immigration Law", "Verified"],
]

for row in lawyer_data:
    lawyer_ws.append(row)

output2 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend", "src", "main", "resources", "lawyer_data.xlsx")
lawyer_wb.save(output2)
print(f"Created: {output2}")
