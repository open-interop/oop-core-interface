require 'watir'
require 'webdrivers'

args = %w[headless disable-gpu disable-dev-shm-usage disable-software-rasterizer no-sandbox]
browser = Watir::Browser.new :chrome, args: args

browser.goto 'localhost:3001/login'

# Authenticate and Navigate to the Form
browser.text_field(id: 'input-email').set 'test@example.com'
browser.text_field(id: 'input-password').set 'testtest'
browser.button(id: 'login-submit').click

sleep(5)

puts browser.title.eql?("Dashboard | Open Interop")

browser.close

sleep(1)

browser = Watir::Browser.new

browser.goto 'localhost:3001/login'

# Authenticate and Navigate to the Form
browser.text_field(id: 'input-email').set 'test@example.com'
browser.text_field(id: 'input-password').set 'wrongpassword'
browser.button(id: 'login-submit').click

sleep(5)

puts browser.text.include?("unauthorized")

browser.close