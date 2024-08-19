class DatabaseRouter:
    """
    we can set configuration in each model respectively
        class Meta:
        db_alias = 'mongodb'
    """

    def db_for_read(self, model, **hints):
        if getattr(model._meta, 'db_alias', None) == 'mongodb':
            return 'mongodb'
        return 'default'

    def db_for_write(self, model, **hints):
        if getattr(model._meta, 'db_alias', None) == 'mongodb':
            return 'mongodb'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        if getattr(obj1._meta, 'db_alias', None) == 'mongodb' or getattr(obj2._meta, 'db_alias', None) == 'mongodb':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if model_name == 'mongomodel':
            return db == 'mongodb'
        return db == 'default'
