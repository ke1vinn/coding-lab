import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import type { TreeNodeProps } from './index';

import { ReactComponent as IconFolderClose } from '../../assets/svg/folder.svg';
import { ReactComponent as IconArrow } from '../../assets/svg/arrow.svg';
import { ReactComponent as IconFile } from '../../assets/svg/file.svg';

interface treeNodeFCProps extends TreeNodeProps {
  nodeIndex: number,
  onBlur: (index: number) => void,
  onEnter: (index: number, name: string, type: 'file' | 'folder', parentPath: string, path: string, depth: number) => void,
}

const CurrentNodeRow = styled.div<{
  depth: number,
  isFolder: boolean,
}>`
  display: flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
  padding: 2px 0 2px ${props => (props.depth - 1) * 18 + (props.isFolder ? 0 : 18) + 6}px;
  
  :hover {
    background-color: #d3d3d3;
  }
  
  & .tree-node-icon {
    flex-shrink: 0;
  }
  
  & button {
    flex-shrink: 0;
  }
  
  input {
    flex: 1;
    min-width: 0;
  }
`;

const ButtonIcon = styled.button`
  height: 1em;
  width: 18px;
  line-height: 1em;
  outline: none;
  border: 0;
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
  user-select: none;
`;

const TemporaryTreeNode: React.FC<treeNodeFCProps> = ({ depth, nodeIndex, parentPath, type, onBlur , onEnter }) => {

  const [ editInputValue, setEditInputValue ] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const isFolder: boolean = type === 'folder';

  const handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    onBlur(nodeIndex);
  };

  const handleKeyDownEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const value = editInputValue.trim();

      onEnter(nodeIndex, value, type, parentPath, parentPath === '/' ? '/' + value : parentPath + '/' + value, depth);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <CurrentNodeRow isFolder={isFolder} depth={depth}>
      {
        isFolder && (
          <ButtonIcon type='button'>
            <IconArrow width='1em' height='1em' className={classNames('tree-node-arrow', 'rotate')} />
          </ButtonIcon>
        )
      }
      {
        isFolder ? (
          <IconFolderClose width='18' height='1em' className="tree-node-icon" />
        ) : (
          <IconFile width='18' height='1em' className="tree-node-icon" />
        )
      }
      <input type="text" ref={inputRef} value={editInputValue} onChange={handleInputChange} onBlur={handleInputBlur} onKeyDown={handleKeyDownEnter} />
    </CurrentNodeRow>
  );
};

export default TemporaryTreeNode;