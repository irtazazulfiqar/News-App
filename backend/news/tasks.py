# backend.news/tasks.py
from celery import shared_task
from backend.celery_script import ArticleScraper
from datetime import datetime


@shared_task
def run_scraper():
    scraper = ArticleScraper(datetime.now().strftime('%Y-%m-%d'))
    scraper.crawl()
