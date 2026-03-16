import { useContext, useMemo, type FC } from 'react'
import { AudioPlayerContext } from '@/components'
import { classNames } from '@/utils'

import './Loader.scss'

export const Loader: FC = () => {
  const { isLoading } = useContext(AudioPlayerContext)
  const classList = classNames({
    'mp-loader': true,
    'mp-loader--loading': isLoading,
  })

  return useMemo(
    () => (
      <span className={classList}>
        <span className="mp-loader__child" data-index="1">
          <span className="mp-loader__child" data-index="2">
            <span className="mp-loader__child" data-index="3">
              <span className="mp-loader__child" data-index="4"></span>
            </span>
          </span>
        </span>
      </span>
    ),
    [isLoading],
  )
}
