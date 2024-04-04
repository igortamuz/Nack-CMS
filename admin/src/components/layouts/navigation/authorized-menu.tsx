import cn from 'classnames';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '@/components/common/avatar';
import Link from '@/components/ui/link';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import { useMeQuery } from '@/data/user';

export default function AuthorizedMenu() {
	const { data } = useMeQuery();
	const { t } = useTranslation("common");

	// Again, we're using framer-motion for the transition effect
	return (
		<Menu as="div" className="relative inline-block text-left">
			<Menu.Button className="flex items-center focus:outline-none">
				<Avatar
					src={
						data?.profile?.avatar?.thumbnail ??
						siteSettings?.avatar?.placeholder
					}
					alt="avatar"
				/>
			</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className="end-0 origin-top-end absolute mt-1 w-48 rounded bg-white shadow-md focus:outline-none"
        >
          <Menu.Item key={data?.email}>
            <li
              className="w-full flex flex-col space-y-1 bg-[#00b791]
             text-white text-sm rounded-t px-4 py-3"
						>
							<span className="font-semibold capitalize">{data?.name}</span>
							<span className="text-xs">{data?.email}</span>
						</li>
					</Menu.Item>

					{siteSettings.authorizedLinks.map(({ href, labelTransKey }) => (
						<Menu.Item key={`${href}${labelTransKey}`}>
							{({ active }) => (
								<li className="border-b border-gray-100 cursor-pointer last:border-0">
									<Link
										href={href}
										className={cn(
											"block px-4 py-3 text-sm capitalize font-semibold transition duration-200 hover:text-accent",
											active ? "text-accent" : "text-heading"
										)}
									>
										{t(labelTransKey)}
									</Link>
								</li>
							)}
						</Menu.Item>
					))}
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
