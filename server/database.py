import peewee

database = peewee.SqliteDatabase("auto-engrave.db")


class SQLiteModel(peewee.Model):
    class Meta:
        database = database


class Design(SQLiteModel):
    name = peewee.CharField()
    description = peewee.CharField()
    filetype = peewee.CharField()
    file = peewee.BlobField()
    created = peewee.DateTimeField()
    updated = peewee.DateTimeField()


class MachineProfile(SQLiteModel):
    name = peewee.CharField()
    description = peewee.CharField()
    created = peewee.DateTimeField()
    updated = peewee.DateTimeField()

    leftRightAxis = peewee.CharField()
    frontBackAxis = peewee.CharField()
    verticalAxis = peewee.CharField()
    rasterScanAxis = peewee.CharField()

    offsetLeft = peewee.FloatField()
    offsetRight = peewee.FloatField()
    offsetBack = peewee.FloatField()
    offsetFront = peewee.FloatField()
    offsetBottom = peewee.FloatField()
    offsetTop = peewee.FloatField()

    maxVelocityX = peewee.FloatField()
    maxVelocityY = peewee.FloatField()
    maxVelocityZ = peewee.FloatField()

    accelerationX = peewee.FloatField()
    accelerationY = peewee.FloatField()
    accelerationZ = peewee.FloatField()


class Template(SQLiteModel):
    name = peewee.CharField()
    description = peewee.CharField()
    created = peewee.DateTimeField()
    updated = peewee.DateTimeField()


class TemplateSlot(SQLiteModel):
    created = peewee.DateTimeField()
    updated = peewee.DateTimeField()
