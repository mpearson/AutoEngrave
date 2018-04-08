import peewee
import os


databaseName = "auto-engrave.db"
database = peewee.SqliteDatabase(databaseName)


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


class MaterialProfile(SQLiteModel):
    name = peewee.CharField()


class Template(SQLiteModel):
    name = peewee.CharField()
    description = peewee.CharField()
    created = peewee.DateTimeField()
    updated = peewee.DateTimeField()


class TemplateSlot(SQLiteModel):
    template = peewee.ForeignKeyField(Template)


def createTables():
    for Model in (Design, MachineProfile, Template, TemplateSlot):
        try:
            Model.create_table()
        except peewee.OperationalError:
            print("%s table already exists!" % Model.__name__)


if not os.path.isfile(databaseName):
    createTables()
