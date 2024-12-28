from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from random import randint, choice, uniform
from datetime import timedelta
import random

from accounts.models import User
from campaign.models import Campaign, Donation
from core.models import Category, Country

class Command(BaseCommand):
    help = 'Generates sample data for testing: 15 users, 50 campaigns, and donations'

    def generate_campaign_data(self, category_name):
        """Generate realistic campaign titles and descriptions based on category"""
        campaign_templates = {
            'Technology': {
                'titles': [
                    "Revolutionary AI-Powered Smart Home Assistant",
                    "Eco-Friendly Solar Backpack with USB Charging",
                    "Next-Gen Wireless Earbuds with Translation",
                    "Sustainable Smart Water Bottle",
                    "Innovative Portable Air Purifier"
                ],
                'descriptions': [
                    "Help us bring cutting-edge technology to everyday life. Our team of engineers has developed {product} "
                    "that will revolutionize how people {action}. With your support, we can begin mass production and "
                    "make this innovation available to everyone at an affordable price."
                ]
            },
            'Arts': {
                'titles': [
                    "Urban Art Gallery for Local Artists",
                    "Community Mural Project",
                    "Indigenous Art Preservation Initiative",
                    "Youth Art Education Program",
                    "Public Sculpture Garden"
                ],
                'descriptions': [
                    "We're creating a space where art can thrive and inspire our community. This project will {action} "
                    "and provide opportunities for {beneficiary}. Your support will help fund materials, space, "
                    "and resources needed to make this vision a reality."
                ]
            },
            'Film': {
                'titles': [
                    "Independent Documentary: Ocean Conservation",
                    "Short Film Series: Urban Stories",
                    "Feature Film: Tales of Immigration",
                    "Youth Film Workshop Program",
                    "Documentary: Local Heroes"
                ],
                'descriptions': [
                    "Our passionate film team is dedicated to telling the untold story of {subject}. "
                    "This project will shed light on {issue} and inspire change through powerful storytelling. "
                    "Your support will help cover production costs, equipment, and post-production expenses."
                ]
            },
            'Education': {
                'titles': [
                    "STEM Learning Lab for Underprivileged Kids",
                    "Mobile Library for Rural Communities",
                    "Coding Boot Camp for Women",
                    "Educational Games for Special Needs",
                    "Adult Literacy Program"
                ],
                'descriptions': [
                    "Education changes lives. Our initiative aims to provide {beneficiary} with access to quality "
                    "education in {subject}. Your contribution will help us purchase necessary materials, "
                    "hire qualified instructors, and create lasting impact in our community."
                ]
            },
            'Music': {
                'titles': [
                    "Youth Orchestra Instruments Fund",
                    "Community Music Studio",
                    "Indigenous Music Preservation",
                    "Music Therapy for Seniors",
                    "Street Music Festival"
                ],
                'descriptions': [
                    "Music has the power to transform lives. This project will bring {program} to {beneficiary}. "
                    "Your support will help fund instruments, instruction, and create opportunities for "
                    "musical expression and growth in our community."
                ]
            }
        }

        # Default template for categories not specifically defined
        default_template = {
            'titles': [
                f"Community {category_name} Initiative",
                f"Innovative {category_name} Project",
                f"Sustainable {category_name} Program",
                f"Local {category_name} Development",
                f"{category_name} for All"
            ],
            'descriptions': [
                "Help us make a difference in the field of {category}. This project aims to {action} "
                "and create positive impact for {beneficiary}. Your support will enable us to "
                "bring this vision to life and serve our community better."
            ]
        }

        template = campaign_templates.get(category_name, default_template)
        
        title = random.choice(template['titles'])
        description_template = random.choice(template['descriptions'])
        
        # Fill in template variables
        description = description_template.format(
            product="innovative solution",
            action="interact with technology",
            beneficiary="local community members",
            subject="important social issues",
            issue="pressing community challenges",
            program="quality education",
            category=category_name
        )

        return title, description

    def handle(self, *args, **kwargs):
        fake = Faker()
        
        # Ensure we have some categories and countries
        if Category.objects.count() == 0:
            self.stdout.write('Creating sample categories...')
            categories = [
                'Technology', 'Arts', 'Film', 'Music', 'Games', 
                'Publishing', 'Food', 'Design', 'Fashion', 'Education'
            ]
            for cat in categories:
                Category.objects.create(
                    name=cat,
                    slug=cat.lower().replace(' ', '-')
                )

        if Country.objects.count() == 0:
            self.stdout.write('Creating sample countries...')
            countries = [
                ('US', 'United States'), ('GB', 'United Kingdom'), 
                ('CA', 'Canada'), ('AU', 'Australia'), ('DE', 'Germany')
            ]
            for code, name in countries:
                Country.objects.create(code=code, name=name)

        # Create 15 users
        self.stdout.write('Creating users...')
        users = []
        for i in range(15):
            email = fake.email()
            username = fake.user_name()
            try:
                user = User.objects.create_user(
                    username=f"{username}_{i}",
                    email=email,
                    password='testpass123',
                    first_name=fake.first_name(),
                    last_name=fake.last_name(),
                    country=Country.objects.order_by('?').first()
                )
                users.append(user)
            except:
                continue

        # Create 50 campaigns with more realistic data
        self.stdout.write('Creating campaigns...')
        campaigns = []
        for i in range(50):
            start_date = timezone.now() - timedelta(days=randint(1, 60))
            category = Category.objects.order_by('?').first()
            title, description = self.generate_campaign_data(category.name)
            
            # Generate realistic goal based on category
            if category.name in ['Technology', 'Film']:
                goal = randint(25000, 150000)
            elif category.name in ['Music', 'Arts']:
                goal = randint(5000, 30000)
            else:
                goal = randint(10000, 50000)

            campaign = Campaign.objects.create(
                title=title,
                description=description,
                user=random.choice(users),
                category=category,
                date=start_date,
                status=choice(['pending', 'active', 'completed']),
                goal=goal,
                location=f"{fake.city()}, {fake.country_code()}",
                deadline=timezone.now().date() + timedelta(days=randint(10, 180))
            )
            campaigns.append(campaign)

        # Create more realistic donations
        self.stdout.write('Creating donations...')
        for campaign in campaigns:
            # Calculate total donations to ensure they don't exceed goal
            total_donated = 0
            target_percentage = random.uniform(0.1, 1.2)  # 10% to 120% of goal
            target_amount = campaign.goal * target_percentage

            while total_donated < target_amount:
                # Generate realistic donation amounts
                if campaign.goal > 50000:
                    donation_amount = randint(50, 5000)
                else:
                    donation_amount = randint(10, 1000)

                if total_donated + donation_amount > target_amount:
                    donation_amount = int(target_amount - total_donated)

                if donation_amount <= 0:
                    break

                Donation.objects.create(
                    campaign=campaign,
                    fullname=fake.name(),
                    email=fake.email(),
                    country=fake.country(),
                    postal_code=fake.postcode(),
                    donation=donation_amount,
                    anonymous=random.choice([True, False]),
                    approved=True,  # Most donations should be approved
                    comment=fake.text(max_nb_chars=200) if random.random() > 0.7 else None,
                    date=campaign.date.date() + timedelta(days=randint(1, 30))
                )
                total_donated += donation_amount

        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {len(users)} users, {len(campaigns)} campaigns, and {Donation.objects.count()} donations'
        )) 

        # def get_random_image():
        #     """Fetch a random image from Lorem Picsum"""
        #     try:
        #         # Get a random image (800x600)
        #         width, height = 800, 600
        #         image_url = f"https://picsum.photos/{width}/{height}"
        #         response = requests.get(image_url)
        #         if response.status_code == 200:
        #             return ContentFile(response.content, name=f"campaign_{random.randint(1, 1000)}.jpg")
        #     except Exception as e:
        #         print(e)
        #     return None
