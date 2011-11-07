import os

from django.db import models
from django.contrib.auth.models import User
import django.utils.simplejson as json

THEMES = (
  ('textmate', 'TextMate'),
  ('eclipse', 'Eclipse'),
  ('dawn', 'Dawn'),
  ('idle_fingers', 'idleFingers'),
  ('pastel_on_dark', 'Pastel on dark'),
  ('twilight', 'Twilight'),
  ('clouds', 'Clouds'),
  ('clouds_midnight', 'Clouds Midnight'),
  ('crimson_editor', 'Crimson'),
  ('kr_theme', 'krTheme'),
  ('mono_industrial', 'Mono Industrial'),
  ('monokai', 'Monokai'),
  ('merbivore', 'Merbivore'),
  ('merbivore_soft', 'Merbivore Soft'),
  ('vibrant_ink', 'Vibrant Ink'),
  ('solarized_dark', 'Solarized Dark'),
  ('solarized_light', 'Solarized Light'),
)

UI_THEMES = (
  ('kendo', 'Kendo'),
  ('black', 'Black'),
  ('blueopal', 'Blue Opal'),
)

SIZES = (
  ('6px', '6px'),
  ('7px', '7px'),
  ('8px', '8px'),
  ('9px', '9px'),
  ('10px', '10px'),
  ('11px', '11px'),
  ('12px', '12px'),
  ('13px', '13px'),
  ('14px', '14px'),
  ('15px', '15px'),
  ('16px', '16px'),
  ('17px', '17px'),
  ('18px', '18px'),
  ('19px', '19px'),
  ('20px', '20px'),
  ('21px', '21px'),
  ('22px', '22px'),
  ('23px', '23px'),
  ('24px', '24px'),
)

KBINDS = (
  ('ace', 'Ace'),
  ('vim', 'Vim'),
  ('emacs', 'Emacs')
)

WRAPS = (
  ('off', 'Off'),
  ('40', '40 Chars'),
  ('80', '80 Chars'),
  ('free', 'Free')
)

class TempFile (models.Model):
  user = models.ForeignKey(User)
  file = models.FileField(upload_to='tmp')
  
class ExtFileRequest (models.Model):
  secret = models.CharField(max_length=255)
  path = models.TextField(max_length=255)
  created = models.DateTimeField(auto_now_add=True)
  
class Preferences (models.Model):
  user = models.OneToOneField(User)

  basedir = models.CharField('Base Directory', max_length=255)
  
  uitheme = models.CharField('UI Theme', choices=UI_THEMES, max_length=25, default='kendo')
  
  theme = models.CharField('Editor Theme', choices=THEMES, max_length=25, default='textmate')
  fontsize = models.CharField('Font Size', choices=SIZES, max_length=10, default='12px')
  keybind = models.CharField('Key Bindings', choices=KBINDS, max_length=10, default='ace')
  swrap = models.CharField('Soft Wrap', choices=WRAPS, max_length=10, default='off')
  
  tabsize = models.IntegerField('Tab Size', default=4)
  
  hactive = models.BooleanField('Highlight Active Line', default=True)
  hword = models.BooleanField('Highlight Selected Word', default=True)
  invisibles = models.BooleanField('Show Invisibles', default=False)
  gutter = models.BooleanField('Show Gutter', default=True)
  pmargin = models.BooleanField('Show Print Margin', default=True)
  softab = models.BooleanField('Use Soft Tab', default=True)
  behave = models.BooleanField('Enable Behaviors', default=True)
  
  save_session = models.BooleanField('Save Session', default=True)
  session = models.TextField(blank=True, null=True)
  
  def last_session (self):
    if self.session:
      return json.dumps(self.session.split("\n"))
      
    return '[]';
    
  def valid_path (self, path):
    path = os.path.normpath(path)
    if path.startswith(self.basedir):
      return True
      
    return False
    
       
