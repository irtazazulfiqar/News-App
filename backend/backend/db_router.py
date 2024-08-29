class DatabaseRouter:
    def db_for_read(self, model, **hints):
        # If the model should use MongoDB
        if model.__name__ in ['Article', ]:
            return 'mongodb'
        # Otherwise, use MySQL
        return 'default'

    def db_for_write(self, model, **hints):
        # If the model should use MongoDB
        if model.__name__ in ['Article', ]:
            return 'mongodb'
        # Otherwise, use MySQL
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        # Allow relations if both objects are in the same database
        if (obj1._state.db == 'mongodb' and obj2._state.db == 'mongodb') or \
                (obj1._state.db == 'default' and obj2._state.db == 'default'):
            return True
        return False

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # Use 'default' for all migrations except for specific MongoDB models
        if model_name in ['Article', ]:
            return db == 'mongodb'
        return db == 'default'
