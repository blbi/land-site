# Generated by Django 2.1.7 on 2019-05-21 08:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('build_type', models.CharField(max_length=50)),
                ('address', models.CharField(max_length=1000)),
                ('nanbang', models.CharField(max_length=50)),
                ('elevator', models.IntegerField(default=0)),
                ('deposit', models.CharField(max_length=50)),
                ('rent', models.IntegerField(default=0)),
                ('premium', models.CharField(max_length=50)),
                ('parking', models.CharField(max_length=50)),
                ('maintenance', models.IntegerField(default=0)),
                ('toilet_place', models.CharField(max_length=50)),
                ('toilet_sex', models.CharField(max_length=50)),
                ('floor', models.CharField(max_length=50)),
                ('area_g', models.CharField(max_length=50)),
                ('area_j', models.CharField(max_length=50)),
                ('move_day', models.CharField(max_length=100)),
                ('business', models.CharField(max_length=200)),
                ('completion', models.CharField(blank=True, max_length=50)),
                ('comment', models.CharField(blank=True, max_length=200)),
            ],
        ),
    ]
