import pandas as pd

# NGO Data
ngos = [
    {"name": "Vidhi Centre for Legal Policy", "focusArea": "Legal Research & Policy", "location": "New Delhi", "verified": True},
    {"name": "Human Rights Law Network (HRLN)", "focusArea": "Human Rights & Legal Aid", "location": "Mumbai", "verified": True},
    {"name": "Commonwealth Human Rights Initiative", "focusArea": "Police Reforms & Transparency", "location": "New Delhi", "verified": True},
    {"name": "Alternative Law Forum (ALF)", "focusArea": "Public Interest Law", "location": "Bengaluru", "verified": True},
    {"name": "Majlis Legal Centre", "focusArea": "Women's Rights", "location": "Mumbai", "verified": True},
    {"name": "Partners for Law in Development", "focusArea": "Family Law & Rights", "location": "New Delhi", "verified": True},
    {"name": "Lawyers Collective", "focusArea": "HIV/AIDS & Health Law", "location": "New Delhi", "verified": True},
    {"name": "Society for Promoting Legal Awareness", "focusArea": "Legal Awareness", "location": "Hyderabad", "verified": True},
    {"name": "National Legal Services Authority", "focusArea": "Free Legal Aid", "location": "India-wide", "verified": True},
    {"name": "MARG (Multiple Action Research Group)", "focusArea": "Legal Literacy", "location": "New Delhi", "verified": True}
]

df_ngos = pd.DataFrame(ngos)
df_ngos.to_excel("ngo_data.xlsx", index=False)
print("Generated ngo_data.xlsx")

# Lawyer Data (Representative Names)
lawyers = [
    {"name": "Senior Adv. Fali S. Nariman", "expertise": "Constitutional Law", "location": "New Delhi", "verified": True},
    {"name": "Senior Adv. Harish Salve", "expertise": "Commercial & International Law", "location": "London/Delhi", "verified": True},
    {"name": "Senior Adv. Indira Jaising", "expertise": "Human Rights & Women's Rights", "location": "New Delhi", "verified": True},
    {"name": "Senior Adv. Kapil Sibal", "expertise": "Constitutional & Civil Law", "location": "New Delhi", "verified": True},
    {"name": "Senior Adv. Mukul Rohatgi", "expertise": "Criminal & Constitutional Law", "location": "New Delhi", "verified": True},
    {"name": "Senior Adv. Prashant Bhushan", "expertise": "Public Interest Litigation", "location": "New Delhi", "verified": True},
    {"name": "Senior Adv. Menaka Guruswamy", "expertise": "Constitutional Law", "location": "New Delhi", "verified": True},
    {"name": "Senior Adv. Rebecca John", "expertise": "Criminal Law", "location": "New Delhi", "verified": True},
    {"name": "Senior Adv. Arvind Datar", "expertise": "Taxation & Corporate Law", "location": "Chennai", "verified": True},
    {"name": "Senior Adv. Shyam Divan", "expertise": "Environmental Law", "location": "Mumbai/Delhi", "verified": True}
]

df_lawyers = pd.DataFrame(lawyers)
df_lawyers.to_excel("lawyer_data.xlsx", index=False)
print("Generated lawyer_data.xlsx")
