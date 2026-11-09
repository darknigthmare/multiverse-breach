"""Navigate the real combat UI without forced clicks or DOM state changes."""
import re
from playwright.sync_api import expect


def open_arsenal(page):
    trigger = page.get_by_role('button', name=re.compile(r'^ARSENAL\b', re.I))
    if trigger.get_attribute('aria-expanded') != 'true':
        trigger.click()
    drawer = page.locator('dialog.combat-drawer.is-live[open]')
    expect(drawer).to_be_visible()
    expect(trigger).to_have_attribute('aria-expanded', 'true')
    return drawer


def close_arsenal(page):
    drawer = page.locator('dialog.combat-drawer.is-live[open]')
    if drawer.count():
        drawer.locator('[data-drawer-close]').click()
        expect(drawer).to_have_count(0)


def click_combat_point(canvas, point):
    """Click a scene coordinate after object-fit: contain adds letterboxing."""
    size = canvas.evaluate('(canvas) => ({width:canvas.width,height:canvas.height})')
    box = canvas.bounding_box()
    assert box and size['width'] > 0 and size['height'] > 0, 'Visible combat canvas required'
    scale = min(box['width'] / size['width'], box['height'] / size['height'])
    canvas.click(position={
        'x': (box['width'] - size['width'] * scale) / 2 + point['x'] * scale,
        'y': (box['height'] - size['height'] * scale) / 2 + point['y'] * scale,
    })
