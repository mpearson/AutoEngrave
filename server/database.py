import peewee
import os
import datetime


databaseName = "auto-engrave.db"
db = peewee.SqliteDatabase(databaseName)


class SQLiteModel(peewee.Model):
    class Meta:
        database = db


class Design(SQLiteModel):
    name = peewee.CharField()
    description = peewee.CharField()
    width = peewee.IntegerField()
    height = peewee.IntegerField()
    dpi = peewee.IntegerField()
    filetype = peewee.CharField()
    imageData = peewee.TextField()
    created = peewee.DateTimeField(default=datetime.datetime.now)
    updated = peewee.DateTimeField(default=datetime.datetime.now)

    def serialize(self):
        return dict(
            id          = self.id,
            name        = self.name,
            description = self.description,
            width       = self.width,
            height      = self.height,
            dpi         = self.dpi,
            filetype    = self.filetype,
            imageData   = self.imageData,
            created     = self.created.isoformat(),
            updated     = self.updated.isoformat(),
        )


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
