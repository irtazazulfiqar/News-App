class DatabaseRouter:
    def db_for_read(self, model, **hints):
        # Check if the app is 'news', use 'default' for it
        if model._meta.app_label == 'news':
            return 'default'
        elif model._meta.app_label == 'mongodb_app':
            return 'mongodb'
        return 'default'

    def db_for_write(self, model, **hints):
        # Check if the app is 'news', use 'default' for it
        if model._meta.app_label == 'news':
            return 'default'
        elif model._meta.app_label == 'mongodb_app':
            return 'mongodb'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        # Allow relations if the apps are 'mongodb_app' or 'news'
        if obj1._meta.app_label in ['mongodb_app', 'news'] or obj2._meta.app_label in ['mongodb_app', 'news']:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # Ensure 'news' uses the 'default' database for migrations
        if app_label == 'news':
            return db == 'default'
        elif app_label == 'mongodb_app':
            return db == 'mongodb'
        return db == 'default'
