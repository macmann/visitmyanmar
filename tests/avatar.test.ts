import { describe,expect,it } from 'vitest';
import { AVATAR_ITEMS, DEFAULT_AVATAR_INVENTORY, validAvatarLoadout } from '@/content/avatar';
import { newPlayer, resolveAction } from '@/lib/rules';

describe('avatar saves',()=>{
 it('gives a new traveler a complete safe starter outfit',()=>{const p=newPlayer('traveler');expect(p.avatarCreated).toBe(false);expect(Object.values(p.avatarLoadout).filter(Boolean).length).toBeGreaterThanOrEqual(6);expect(Object.values(p.avatarLoadout).filter(Boolean).every(id=>p.avatarInventory.includes(id!))).toBe(true)});
 it('migrates an existing save without resetting journey progress',()=>{const existing=newPlayer('existing');existing.mmk=7777;existing.discoveries=['shwedagon'];delete (existing as Partial<typeof existing>).avatarInventory;delete (existing as Partial<typeof existing>).avatarLoadout;const migrated=resolveAction(existing);expect(migrated.mmk).toBe(7777);expect(migrated.discoveries).toEqual(['shwedagon']);expect(migrated.avatarCreated).toBe(true);expect(migrated.avatarInventory).toEqual(expect.arrayContaining(DEFAULT_AVATAR_INVENTORY))});
 it('replaces missing or wrong-slot cosmetic ids with defaults',()=>{const loadout=validAvatarLoadout({TOP:'traveler_cap',HAIR:'missing'});expect(loadout.TOP).toBe('traveler_tshirt_blue');expect(loadout.HAIR).toBe('hair_short_black')});
 it('keeps market cosmetics explicitly non-default',()=>{expect(AVATAR_ITEMS.filter(x=>x.unlockType==='MARKET').every(x=>!x.defaultOwned&&x.price>0)).toBe(true)});
});
